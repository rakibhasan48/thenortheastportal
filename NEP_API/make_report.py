import createReport
import makingGraph
import sendEmail
from info import Report,Extra,Graph
import os

def create_files(comments,name):
    file_pos = open(Extra+name+"_pos.txt", mode="w", encoding='utf-8')
    file_neg = open(Extra+name+"_neg.txt", mode="w", encoding='utf-8')


    for comment in comments:
        if comment.sentiment is 1:
            count = 0
            for text in comment.text.split(" "):
                for c in text:
                    file_pos.write(c)
                    count += 1
                file_pos.write(" ")
                if count > 115:
                    file_pos.write("\n")
                    count = 0
            file_pos.write("\n")

        elif comment.sentiment is -1:
            count = 0
            for text in comment.text.split(" "):
                for c in text:
                    file_neg.write(c)
                    count += 1
                file_neg.write(" ")
                if count > 115:
                    file_neg.write("\n")
                    count = 0
            file_neg.write("\n")

    file_pos.close()
    file_neg.close()


def Clean_up(name):
    if os.path.isfile(Extra+name+"_pos.txt"):
        os.remove(Extra+name+"_pos.txt")
    if os.path.isfile(Extra+name+"_neg.txt"):
        os.remove(Extra+name+"_neg.txt")

    if os.path.isfile(Report+name+".pdf"):
        os.remove(Report+name+".pdf")

    if os.path.isfile(Graph+name+".jpg"):
        os.remove(Graph+name+".jpg")

def start(comments,report_name,ministry,project,email):
    try :
        create_files(comments=comments,name=report_name)
        createReport.start(name=report_name,ministry=ministry,project=project)
        makingGraph.start(comments,report_name)
        sendEmail.start(name=report_name,email=email)
        Clean_up(name=report_name)

        return True,None
    except Exception as e:
        print(e)
        return False,e
