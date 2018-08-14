from Sentimental_Analysis import preprocessing
import os
from Sentimental_Analysis.info import trainLable, trainFile, testLable, trainFeature, testFile, testFeature, prefix, word ,processData, WordList,WordVector,dataset,Model
import sys


if not os.path.exists(dataset) or not  os.path.isfile(testFile) or not os.path.isfile(trainFile):
    print("Extract file dataset.tar.gz")
    sys.exit()

if not os.path.exists(word) or not  os.path.isfile(WordList) or not os.path.isfile(WordVector):
    print("Extract file word.tar.gz")
    sys.exit()


if not os.path.exists(processData):
    os.makedirs(processData)

if not os.path.isfile(testFeature):
    preprocessing.create_feature(testFile, testFeature)

if not os.path.isfile(testLable):
    preprocessing.create_lable(testFile, testLable)

if not os.path.isfile(trainFeature):
    preprocessing.create_feature(trainFile, trainFeature)

if not os.path.isfile(trainLable):
    preprocessing.create_lable(trainFile, trainLable)

try:
    from Sentimental_Analysis import model
    if not os.path.exists(Model):
        model.create_model()
except Exception as e:
    #print("Run the above Code by Commenting this try and except block")
    print(e)