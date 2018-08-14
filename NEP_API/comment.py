from dateutil.parser import parse
class Comment:
    def __init__(self,text,time,sentiment):
        self.text = text
        self.time = parse(time)
        self.sentiment = sentiment
