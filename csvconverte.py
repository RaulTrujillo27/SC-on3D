import csv
import numpy as np
import pandas as pd

with open('datafiles\cereal_data_no_missing.txt', newline='') as csvfile:
    spamreader1 = csv.reader(csvfile, delimiter='\t', quotechar='|')
    lista1 = list(spamreader1)
    matrix1 = np.array(lista1).astype("float")

with open('datafiles\parkinsons_train_matriz_PCA.txt', newline='') as csvfile:
    spamreader2 = csv.reader(csvfile, delimiter='\t', quotechar='|')
    lista2 = list(spamreader2)
    matrix2 = np.array(lista2).astype("float")


dFrame = pd.DataFrame(matrix1,columns=['D1','D2','D3','D4','D5','D6','D7','D8','D9'])
dFrame1 = pd.DataFrame(matrix2,columns=['D1','D2','D3'])


jsonfile = dFrame.to_json('archivosjson/cereal_data_no_missing.json',orient='records')
jsonfile1 = dFrame1.to_json('archivosjson/parkinsons_train_matriz_PCA.json',orient='records')
