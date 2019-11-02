import json

grade_Converter = {"A*" : 56,
                   "A" : 48,
                   "B" : 40,
                   "C" : 32}

uni_Requirements = [("University of Cambridge", 160),
                    ("Imperial College London", 152),
                    ("University of Oxford", 152),
                    ("Durham University", 152), 
                    ("University College London", 144),
                    ("King's College London", 144),
                    ("University of Warwick", 144),
                    ("London School of Economics and Political Science", 136)]

predicted_Grades = ARG

ucas_Score = sum(map(lambda x: grade_Converter[x], predicted_Grades))

valid_Unis = list(map(lambda x: x[0], (filter(lambda x: x[1] <= ucas_Score, uni_Requirements))))

print(json.dumps(valid_Unis))
