import numpy as np
import tensorflow as tf
from Sentimental_Analysis.info import testFeature,trainFeature,testLable,trainLable,Model,WordVector,prefix

trainFeatures = np.load(trainFeature)
trainLables = np.load(trainLable)
testFeatures = np.load(testFeature)
testLables = np.load(testLable)

maxSeqLength = 250
batchSize = 24
lstmUnits = 256
numClasses = 2
iterations = 1000000000
trainCount = len(trainFeatures)
train = 0
test = 0
numDimensions = 300  # Dimensions for each word vector
wordVectors = np.load(WordVector)
sess = tf.InteractiveSession()


def getTrainBatch():
    global train
    try:
        if train + batchSize >= trainCount:
            train = 0
        lable = trainLables[train:train + batchSize]
        arr = trainFeatures[train:train + batchSize]
        train += batchSize


    except:
        lable = trainLables[train:len(trainLables)]
        arr = trainFeatures[train:len(trainFeatures)]
        train = 0
        print("in exception ",train)
    return arr, lable




def getTestBatch():
    global test
    try:
        lable = testLables[test:test + batchSize]
        arr = testFeatures[test:test + batchSize]
        test += batchSize

    except:
        lable = testLables[test:len(testLables)]
        arr = testFeatures[test:len(testFeatures)]
        test = 0
    return arr, lable

def create_model():
    global sess,iterations
    tf.reset_default_graph()

    labels = tf.placeholder(tf.float32, [batchSize, numClasses])
    input_data = tf.placeholder(tf.int32, [batchSize, maxSeqLength])

    data = tf.Variable(tf.zeros([batchSize, maxSeqLength, numDimensions]), dtype=tf.float32)
    data = tf.nn.embedding_lookup(wordVectors, input_data)

    lstmCell = tf.contrib.rnn.BasicLSTMCell(lstmUnits)
    lstmCell = tf.contrib.rnn.DropoutWrapper(cell=lstmCell, output_keep_prob=0.75)
    value, _ = tf.nn.dynamic_rnn(lstmCell, data, dtype=tf.float32)

    weight = tf.Variable(tf.truncated_normal([lstmUnits, numClasses]))
    bias = tf.Variable(tf.constant(0.1, shape=[numClasses]))
    value = tf.transpose(value, [1, 0, 2])
    last = tf.gather(value, int(value.get_shape()[0]) - 1)
    prediction = (tf.matmul(last, weight) + bias)

    correctPred = tf.equal(tf.argmax(prediction, 1), tf.argmax(labels, 1))
    accuracy = tf.reduce_mean(tf.cast(correctPred, tf.float32))

    loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=prediction, labels=labels))
    optimizer = tf.train.AdamOptimizer().minimize(loss)

    import datetime

    tf.summary.scalar('Loss', loss)
    tf.summary.scalar('Accuracy', accuracy)
    merged = tf.summary.merge_all()
    logdir = prefix+"tensorboard/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S") + "/"
    writer = tf.summary.FileWriter(logdir, sess.graph)

    sess = tf.InteractiveSession()
    saver = tf.train.Saver()
    sess.run(tf.global_variables_initializer())

    for i in range(iterations):
        # Next Batch of reviews
        nextBatch, nextBatchLabels = getTrainBatch()
        sess.run(optimizer, {input_data: nextBatch, labels: nextBatchLabels})

        # Write summary to Tensorboard
        if i % 50 == 0:
            summary = sess.run(merged, {input_data: nextBatch, labels: nextBatchLabels})
            writer.add_summary(summary, i)

        # Save the network every 10,000 training iterations
        if i % 1000 == 0 and i != 0:
            save_path = saver.save(sess, prefix+"models/pretrained_lstm.ckpt", global_step=i)
            print("saved to %s" % save_path)
    writer.close()

    saver = tf.train.Saver()
    saver.restore(sess, tf.train.latest_checkpoint(Model))

    iterations = 10
    for i in range(iterations):
        nextBatch, nextBatchLabels = getTestBatch();
        print("Accuracy for this batch:", (sess.run(accuracy, {input_data: nextBatch, labels: nextBatchLabels})) * 100)


if __name__ == "__main__":
    create_model()