
import requests
import time
import matplotlib.pyplot as plt
import numpy as np

x = 0
y = 0

plt.ion()

fig = plt.figure()
ax = fig.add_subplot(111)
line1, = ax.plot(x, y, 'r-', marker='o')
plt.xlim(0, 1)
plt.ylim(0, 1)

while True:
    j = requests.get('http://localhost:3000/api/engine/get/1').json()
    x = j['ball']['posx']
    y = j['ball']['posy']
    line1.set_ydata(y)
    line1.set_xdata(x)
    fig.canvas.draw()
    fig.canvas.flush_events()
    print(x, y)


