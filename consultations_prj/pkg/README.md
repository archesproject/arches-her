# consultations-pkg

## options
```
-db : run setup_py to rebuild your database
-ow : overwrite concepts and collections 
-st : stage concepts and collections
-s  : a zipfile located on github or locally
-y  : accept defaults
```

## load data
To load data the target must be an arches project rather than the arches application:

```
arches-project create myproject
cd myproject
python manage.py packages -o load_package -s https://github.com/archesproject/consultations-pkg/archive/master.zip -db true -y
```
