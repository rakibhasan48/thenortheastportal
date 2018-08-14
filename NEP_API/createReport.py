import reportlab
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from info import Report,Extra
x, y = (inch * .75, 11 * inch)
leading = 8
pos = neg = 0


def start(project, ministry,name):
    global pos, neg
    c = canvas.Canvas(Report+name+".pdf", pagesize=(850, 900))

    reportTemplet(c, project, ministry)
    file = open(Extra+name+"_pos.txt", mode="r", encoding='utf-8')

    textobject = c.beginText()
    textobject.setTextOrigin(x, y - .2 * inch)
    textobject.setFont("Times-Roman", 14)
    textobject.setLeading(15)
    for line in file:
        pos += 1
        if (line == '\n' or line == '\r'):
            continue
        line = line.strip('\n')
        textobject.textLine(line)

    file.close()
    file = open(Extra+name+"_neg.txt", mode="r", encoding='utf-8')
    textobject.setFont("Times-BoldItalic", 15)
    textobject.textLine("")
    textobject.textLine("Negative : ")
    textobject.setFont("Times-Roman", 12)
    for line in file:
        neg += 1
        if (line == '\n' or line == '\r'):
            continue
        line = line.strip('\n')
        textobject.textLine(line)
    file.close()

    percentage = 100 * neg / (neg + pos)
    if (percentage > 70):
        status = "NOT SATISFY"
    elif (percentage > 40):
        status = "SATISFY"
    else:
        status = "HAPPY"
    c.drawString(3 * inch, 11.65 * inch, "Status:- {} ".format(status))
    c.drawText(textobject)
    c.showPage()
    c.save()


def reportTemplet(c, project, ministry):
    from time import gmtime, strftime
    showtime = strftime("%Y-%m-%d %H:%M:%S", gmtime())

    c.drawString(4 * inch, 12.15 * inch, "Project Name:- {}".format(project.capitalize()))
    c.drawString(4 * inch, 11.9 * inch, "Ministry Name:- {}".format(ministry.capitalize()))
    c.drawString(8 * inch, 11.65 * inch, "Date:-{} ".format(showtime))

    c.rect(0.5 * inch, .5 * inch, 11 * inch, 10.9 * inch, fill=0)

    textobject = c.beginText()
    textobject.setTextOrigin(x, y)
    textobject.setFont("Times-BoldItalic", 20)
    charspace = 0
    textobject.setCharSpace(charspace)
    textobject.textLines("Positive: ")
    c.drawText(textobject)
