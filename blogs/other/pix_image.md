---
title: 拼接像素图
date: 2024/02/25
categories:
 - 其他
 - 拼图
---

# 拼图

本文介绍如何将大量图片拼接为指定图片的样式，效果图如下：

<img src="https://img-blog.csdnimg.cn/20190717102229545.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1aWNoZW5nX2NoZW4=,size_16,color_FFFFFF,t_70" alt="img" style="zoom:90%;" />

## 思路：

我们都知道图片是由一个一个像素点组成的，想要实现以上效果，只需要使用与指定图片中像素相似的图片替换对应的像素即可，首先找到与像素相似的图片，然后通过遍历指定图片中的每一个像素，分别使用相似图片替换即可。

### 图片与像素的相似度计算

#### 计算图片的平均RGB

遍历给定图片的每个像素，将像素的RGB值进行累加，最后计算平均值。

```python
data = list(image.getdata())
RGB = np.array([0,0,0])
for i in data:
    a = np.array(i)
    RGB = np.add(a,RGB)
RGB = list(b)
RGB = [i // len(data) for i in b]
```

通过该方式计算出图片的RGB（左），与原图（中）的对比效果如下（右：另一种计算方式）：

![img](https://img-blog.csdnimg.cn/20190717100935923.jpg)

#### 相似度计算

相似度通过图片的平均RGB与像素RGB的曼哈顿距离表示，距离越小，越相似。

```python
# 计算相似性，colorlist备选图片对应的RGB pixel指定图片的像素值RGB similer相似度阈值，小于该值判定为相似
def findSimilerImage(colorlist,pixel,similer):
    index = []
    for i in range(len(colorlist)):
        #计算 RGB间的曼哈顿距离
        temp = abs(colorlist[i][0]-pixel[0]) + abs(colorlist[i][1]-pixel[1]) + abs(colorlist[i][2]-pixel[2])
        if(temp < similer):
            index.append(i)
    if(len(index) == 0):#如果没有相似图片 增大similer
        index = findSimilerImage(colorlist,pixel,2*similer)
    return index
```

#### 填充指定图片的像素

给定一张图片如下：

<img src="https://img-blog.csdnimg.cn/20190717095540564.jpg" alt="img" style="zoom:400%;" />

并指定填充该图片的图片集，一个包含大量图片的文件夹。填充效果如下：

<img src="https://img-blog.csdnimg.cn/20190717102229545.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1aWNoZW5nX2NoZW4=,size_16,color_FFFFFF,t_70" alt="img" style="zoom:45%;" />

#### 细节展示

<img src="https://img-blog.csdnimg.cn/20190717102157932.png" alt="img" style="zoom:90%;" />

<img src="https://img-blog.csdnimg.cn/20190717102134477.png" alt="img" style="zoom:97%;" />

## 全部代码

```python
# -*- coding: utf-8 -*-
"""
Created on Tue Jul 16 12:18:04 2019
@author: icheng
"""
import argparse
from PIL import Image
import numpy as np
import random
import time
import os

def setSize(path,savepath,x,y): 
    """
    重新设置图片大小  最终输出为保存图片为x*y像素
    path :资源图片路径   savepath:输出图片保存路径
    """
    print(path)
    image = Image.open(path)
    width, height = image.size
    if(width > height):
        left = (width - height) // 2
        box=(left,0,left + height,height)
        image = image.crop(box)
    elif(width < height):
        top = (height - width) // 2
        box=(0,top,width,top + width)
        image = image.crop(box)
    image = image.resize((x,y),Image.ANTIALIAS)  #此处可更改输出图片大小
    image = image.convert('RGB')
    image.save(savepath)


 
def getColor(path): 
    """
    获取图片的大致色彩 保存为RGB
    """   
    image = Image.open(path)
    data = list(image.getdata())
    b = np.array([0,0,0])
    for i in data:
        a = np.array(i)
        b = np.add(a,b)
    b = list(b)
    b = [i // len(data) for i in b]
    b = tuple(b)
    c = np.array([0,0,0])
    count = 0
    for i in data:
        a = np.array(i)
        temp = list(np.subtract(a,b))
        temp = abs(temp[0]) + abs(temp[1]) + abs(temp[2])
        if(temp > 200):
            continue
        count += 1
        c = np.add(a,c)
    c = list(c)
    c = [i // count for i in c]
    c = tuple(c)
    return c           #此处可选择  b  OR  c


def write(data):
    path = 'colorlist.txt'
    f = open(path,'w')
    for i in data:
        f.write(str(i)+'\n')
    f.close()
    
def read():
    path = 'colorlist.txt'
    data = []
    f = open(path,'r')
    for line in f:
        temp = line[1:-2].split(',')
        temp = [int(i.strip()) for i in temp]
        data.append(temp)
    f.close()
    return data

def imageToColor(num):  #将批量图片转化为颜色 
    data = []
    for i in range(num):
        path = 'source\image_{}.jpg'.format(i)
        color = getColor(path)
        data.append(color)
    write(data)

 #查找与 像素 最相近的点
def findSimilerImage(data,pixel,similer):
    index = []
    for i in range(len(data)):
        temp = abs(data[i][0]-pixel[0]) + abs(data[i][1]-pixel[1]) + abs(data[i][2]-pixel[2])
        if(temp < similer):
            index.append(i)
    if(len(index) == 0):
        index = findSimilerImage(data,pixel,2*similer)
    return index
    
def dealImage(path,edge):  
    """
    处理图片  输出 像素填充图
    """
    data = read()
    inImage = Image.open(path)
    x = inImage.size[0]
    y = inImage.size[1]
    outImage = Image.new('RGB',(x*edge,y*edge))
    for i in range(x):
        for j in range(y):
            pixel = inImage.getpixel((i,j))
            indexlist = findSimilerImage(data,pixel,100)
            index = random.randint(0,len(indexlist)-1)
            sourcePath = 'source\image_{}.jpg'.format(indexlist[index])
            sourceImage = Image.open(sourcePath)
            outImage.paste(sourceImage,(i*edge,j*edge))
    outImage.save('ouput.jpg')
     
        
        
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', type=str, default='', help='imgs path must')
    parser.add_argument('--resize', type=int, default='100', help='imgs resize')
    parser.add_argument('--img', type=str, default='', help='source img must')
    parser.add_argument('--size', type=int, default='100', help='img size')
    opt = parser.parse_args()

    if(opt.path != ""):
        path=opt.path
        resize=opt.resize
        imgs = os.listdir(path)
        i=0
        for img in imgs:
            if(img.endswith(".jpg") or img.endswith(".png")):
                imgpath = os.path.join(path,img)
                savepath = os.path.join("source","image_{}.jpg".format(i))
                setSize(imgpath,savepath,resize,resize)   
        
    if(opt.img != ""):
        imgs = os.listdir("source")
        if(len(imgs) > 0):
            print('Processing...')
            imageToColor(len(imgs))
            imgpath = opt.img
            dealImage(imgpath,len(imgs))
            print('successfully')
        else:
            print("please using: python pixelImage.py --path [imgs_path] --resize [size]")
    print('Exit after 3 seconds')
    time.sleep(3)
```

```shell
python pixelImage.py --path [图片集路径，一个文件夹存放生活照] --img [指定的图片，想生成的样子]
```

[Github](https://github.com/chen-huicheng/Pistachio/tree/main/pixelImage)



## 可执行文件exe

![img](https://img-blog.csdnimg.cn/20190731175626272.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2h1aWNoZW5nX2NoZW4=,size_16,color_FFFFFF,t_70)

1、点击**选择文件夹**选择图片所在文件夹（这里的图片由于拼接，即最终像素填充图中的小图片）

2、点击**选择图片** 选择带拼接图片

3、点击执行即可

可运行文件下载

链接: https://pan.baidu.com/s/1UNELXOg2lciSWqO75MTfVQ 提取码: x2ky 复制这段内容后打开百度网盘手机App，操作更方便哦