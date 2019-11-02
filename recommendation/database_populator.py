import pandas as pd
import random

cols = ["first_name", "last_name", "email", "gender", "city",
        "a_level_1", "a_level_2", "a_level_3", "a_level_4",
        "grade_1", "grade_2", "grade_3", "grade_4",
        "course", "university"]

first_names = ["Aaron", "Bruno", "Charlie"]

last_names = ["Aaronson", "Brunoson", "Charlieson"]

cities = ["London", "Maidstone", "Londonderry", "Uxbridge", "North Islington"]

alevels = ["Art", "Biology", "Chemistry", "Computer Science", "Economics",
           "English", "Geography", "History", "Maths", "Music", "Physics",
           "Politics", "Psychology", "Religious Studies", "nothing"]

courses = ["Mathematics", "Computer Science", "Physics", "Biology",
           "Chemistry", "Architecture", "Art", "Mechanical Engineering",
           "Medicine"]

associated_alevels_vals = ['Maths', 'Computer Science', 'Physics', 'Biology', 
                      'Chemistry', 'Art', 'Art', 'Physics', 'Biology']

associated_alevels = dict(zip(courses, associated_alevels_vals))

universities = ["Imperial College London", "University of Cambridge",
                "University of Oxford", "University College London",
                "Durham University", "King's College London",
                "London School of Economics and Political Science",
                "University of Warwick"]

grades = ["A*", "A", "B", "C"]

def gen_dict(course):
  dic = {}
  dic['course'] = course
  dic['a_level_1'] = associated_alevels[course]
  for i in range(2, 5):
    dic['a_level_' + str(i)] = random.choice(alevels)
  dic['first_name'] = random.choice(first_names)
  dic['last_name'] = random.choice(last_names)
  dic['university'] = random.choice(universities)
  dic['city'] = random.choice(cities)
  
  return dic
  

dicts = [ gen_dict(course) for i in range(100) for course in courses ] 

df = pd.DataFrame(dicts)

df.to_csv("db.csv")
