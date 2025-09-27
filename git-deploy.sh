#!/bin/bash
echo "Escribe tu mensaje de commit:"
read msg

git add .
git commit -m "$msg"
git push
