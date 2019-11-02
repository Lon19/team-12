import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor

aLevels = ['Art', 'Biology', 'Chemistry', 'Computer Science', 'Economics', 'English', 'Geography', 'History', 'Maths', 'Music', 'Physics', 'Politics', 'Psychology', 'Religious Studies', 'nothing']

courses = ['Mathematics', 'Computer Science', 'Physics', 'Biology', 'Chemistry', 'Architecture', 'Art', 'Mechanical Engineering', 'Medicine']

dataset = pd.read_csv('data.csv')

colOffset = dataset.shape[1]
for i in range(len(aLevels)):
  dataset.insert(colOffset + i, aLevels[i], 0)

print(dataset.head())

aLevelColNames = ['a_level_1', 'a_level_2', 'a_level_3', 'a_level_4']
for i in range(dataset.shape[0]):
  for colName in aLevelColNames:
    dataset.at[i, dataset.at[i, colName]] = 1

dataset = dataset.drop(columns=aLevelColNames)

for course in courses:
  dataset.insert(dataset.shape[1], "Taking " + course, 0)
for i in range(dataset.shape[0]):
  course = dataset.at[i, 'course']
  dataset.at[i, "Taking " + course] = 1

print(dataset.head())

regressors = {}

for i in range(len(courses)):
  indexFromEnd = i - len(courses)

  X = dataset.iloc[:, -len(aLevels):].values
  y = dataset.iloc[:, indexFromEnd].values


  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

  # Feature Scaling

  sc = StandardScaler()
  X_train = sc.fit_transform(X_train)
  X_test = sc.transform(X_test)

  regressor = RandomForestRegressor(n_estimators=20, random_state=0)
  regressor.fit(X_train, y_train)

  regressors[courses[i]] = regressor
  

#y_pred = regressor.predict(X_test)

from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

#print(confusion_matrix(y_test,y_pred))
#print(classification_report(y_test,y_pred))
#print(accuracy_score(y_test, y_pred))

aLevelsTaking = list(map(lambda _: 0, aLevels))
aLevelsTaking[0] = 1
aLevelsTaking[1] = 1
aLevelsTaking[2] = 1

print(regressors['Mathematics'].predict([aLevelsTaking]))
