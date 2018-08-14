# North East Portal

In the north eastern region there is a distinct lack of proper and accurate information regarding activities of various ministries/departments accessible to the public. As a result, the general population can’t hold the departments/ministries responsible. The solution that we propose to alleviate this  lack of transparency is to create an online portal that showcases the ongoing projects, their status, budget sanctions and all relevant information in an attractively designed and user-friendly website. This will help MoDoNer monitor and keep track of all ongoing projects and get feedback from the people of the North East. This will be a step in the right direction for the development and progress of the North Eastern region.
Along with the portal we have created an NLP API that will apply sentimental analysis to the comments posted by the public users and generate a report that will be sent to the ministry.



## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Install python 3.6.5 the website of python is given blow or use distribution as Anaconda.
Then clone this repo in your system
```
https://www.python.org/downloads/release/python-365/
https://www.anaconda.com/download/
git clone https://github.com/rakibhasan48/thenortheastportal
```

### Installing
Install all the requirement given in the requirement .txt as the commend .


```
pip install -r requirement.txt
```
If want to run tensorflow in GPU install tensorflow GPU
Choose the link as your operating system.and the language is python. 

```
https://www.tensorflow.org/install/
```
for Tensorflow GPU the instruction are given in the website follow them.


for the package nltk you have to install the requirment .to install them open Terminal and the command are given 
```
python
import nltk
nltk.download()
```
it will open an GUI and click all

## Running the tests

to run the system first decompress the files go to Sentimental_analysis folder and run command

```
tar -xvzf word.tar.gz
tar -xvzf dataset.tar.gz
```
then come back to the NEP_API folder and run the landing.py file
```
Windows:
python landing.py
Unix Base: 
export FLASK_APP=Landing
flask run 
```

for first time it will take long time about 12 - 36 hours according your system.


## Deployment
for deployment buy an domain for api set up the port number in the landing.py file

## Built With

* Mayank Maheshwari : https://github.com/MayankMmu
* Rakib hasan : https://github.com/rakibhasan48


## Contributing

Please read [CONTRIBUTING.md]


## Acknowledgments

*
