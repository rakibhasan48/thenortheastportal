import matplotlib.pyplot as plt
from matplotlib.dates import date2num
from info import Graph

def start(obj, name):
    x = []
    y = []
    k = 0
    for o in obj:
        if o.sentiment == 1:
            k+=1
        elif o.sentiment == -1:
            k-=0.5
        y.append(k)
        x.append(date2num(o.time))

    plt.plot_date(x,y,"-")
    plt.xlabel('TIME')
    plt.ylabel('INDIAN REACTION')
    plt.title('PROJECT DETAIL')
    plt.gcf().autofmt_xdate()
    plt.savefig(Graph+name+".jpg")
    plt.close()
