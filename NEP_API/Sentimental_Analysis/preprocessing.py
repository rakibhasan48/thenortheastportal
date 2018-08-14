import re
import numpy as np
from Sentimental_Analysis.info import WordList,WordVector
strip_special_chars = re.compile("[^A-Za-z0-9 ]+")



def get_len(file):
    count = 0
    with open(file, buffering=20000) as f:
        lines = f.read()
        for line in lines.split("\n"):
            count += 1
    return count


def cleanSentences(string):
    string = string.lower().replace("<br />", " ")
    *s, string = string.split(":::")
    return re.sub(strip_special_chars, "", string.lower())


def create_feature(fin, fout):
    wordsList = np.load(WordList)
    print('Loaded the word list!')
    wordsList = wordsList.tolist()  # Originally loaded as numpy array
    wordsList = [word.decode('UTF-8') for word in wordsList]  # Encode words as UTF-8
    wordVectors = np.load(WordVector)
    print('Loaded the word vectors!')

    maxSeqLength = 250
    numFiles = get_len(fin)

    ids = np.zeros((numFiles, maxSeqLength), dtype='int32')
    lineCount = 0
    with open(fin, "r") as f:
        lines = f.read()
        for line in lines.split("\n"):
            indexCounter = 0
            cleanedLine = cleanSentences(line)
            split = cleanedLine.split()

            for word in split:
                try:
                    ids[lineCount][indexCounter] = wordsList.index(word)
                except ValueError:
                    ids[lineCount][indexCounter] = 399999  # Vector for unkown words
                indexCounter = indexCounter + 1
                if indexCounter >= maxSeqLength:
                    break
            if lineCount % 1000 == 0:
                print(lineCount)
            lineCount += 1
    np.save(fout, ids)


def create_lable(fin, fout):
    with open(fin, "r") as f:
        lable = []
        lines = f.read()
        for line in lines.split("\n"):
            l = line.split(":::")[0]
            lable.append(l)
    count = 0
    npa = np.zeros([get_len(fin), 2], dtype=np.int)
    for i in lable:
        try:
            npa[count][0] = int(i[1])
            npa[count][1] = int(i[3])
            count += 1
        except:
            print(count)

    np.save(fout, npa)


