from info import GMAIL_USER_NAME,GMAIL_PASSWORD,Report,Graph
import smtplib
import mimetypes
from email.mime.multipart import MIMEMultipart
from email import encoders
from email.message import Message
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.text import MIMEText


def start(name,email):
    emailfrom =GMAIL_USER_NAME
    emailto = email
    fileToSend = Report+name+".pdf"
    secondFileToSend =Graph+name+'.jpg'

    msg = MIMEMultipart()
    msg["From"] = emailfrom
    msg["To"] = emailto
    msg["Subject"] = name+" Report "
    msg.preamble = "Report for Ministry"

    ctype, encoding = mimetypes.guess_type(fileToSend)
    if ctype is None or encoding is not None:
        ctype = "application/octet-stream"

    ctype2, encoding2 = mimetypes.guess_type(secondFileToSend)
    if ctype2 is None or encoding2 is not None:
        ctype2 = "application/octet-stream"

    maintype2, subtype2 = ctype2.split("/", 1)
    maintype, subtype = ctype.split("/", 1)
    if maintype == "text":
        fp = open(fileToSend)
        # Note: we should handle calculating the charset
        attachment = MIMEText(fp.read(), _subtype=subtype)
        fp.close()
    elif maintype == "image":
        fp = open(fileToSend, "rb")
        attachment = MIMEImage(fp.read(), _subtype=subtype)
        fp.close()
    elif maintype == "audio":
        fp = open(fileToSend, "rb")
        attachment = MIMEAudio(fp.read(), _subtype=subtype)
        fp.close()
    else:
        fp = open(fileToSend, "rb")
        attachment = MIMEBase(maintype, subtype)
        attachment.set_payload(fp.read())
        fp.close()
        encoders.encode_base64(attachment)
    attachment.add_header("Content-Disposition", "attachment", filename=fileToSend)
    msg.attach(attachment)

    if maintype2 == "text":
        fp = open(secondFileToSend)
        # Note: we should handle calculating the charset
        attachment2 = MIMEText(fp.read(), _subtype=subtype)
        fp.close()
    elif maintype2 == "image":
        fp = open(secondFileToSend, "rb")
        attachment2 = MIMEImage(fp.read(), _subtype=subtype)
        fp.close()
    elif maintype2 == "audio":
        fp = open(secondFileToSend, "rb")
        attachment2 = MIMEAudio(fp.read(), _subtype=subtype)
        fp.close()
    else:
        fp = open(secondFileToSend, "rb")
        attachment2 = MIMEBase(maintype, subtype)
        attachment2.set_payload(fp.read())
        fp.close()
        encoders.encode_base64(attachment2)
    attachment2.add_header("Content-Disposition", "attachment", filename=secondFileToSend)
    msg.attach(attachment2)

    server = smtplib.SMTP("smtp.gmail.com",587)
    server.starttls()
    server.login(GMAIL_USER_NAME,GMAIL_PASSWORD)
    server.sendmail(emailfrom, emailto, msg.as_string())
    print("done")
    server.quit()
