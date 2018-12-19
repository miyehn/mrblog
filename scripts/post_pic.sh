#!/usr/local/bin/python2
# -*- coding: utf-8 -*-

import glob
import os
import sys
import time
import pyperclip

content_dir = os.environ['MRBLOG_CONTENT']
domain = os.environ['MRBLOG_DOMAIN']

if len(sys.argv)<2:
    print('gimme an image as argument')
else:
    img_path = sys.argv[1]
    os.system('cp '+img_path+' '+content_dir+'/pics')
    name = os.path.splitext(os.path.basename(img_path))
    ts = str(int(time.time())) # timestamp
    src = content_dir+'/pics/'+name[0]+name[1]
    dst = content_dir+'/pics/'+ts+name[1]
    os.rename (src, dst)

    md_str = '![]('+domain+'/mrblog-content/pics/'+ts+name[1]+')'
    pyperclip.copy(md_str)
    print(md_str)
    print('(it\'s already copied to clipboard!)')