from nltk.tokenize import word_tokenize


class Abuse:
    def __init__(self):
        self.abuse = []
        with open("abuse.txt", mode="r", buffering=2000) as f:
            for i in f.read().split("/"):
                self.abuse.append(i)


    def checkAbuse(self, text):
        message = word_tokenize(text.lower())
        for m in message:
            if m in self.abuse:
                return True
        return False
