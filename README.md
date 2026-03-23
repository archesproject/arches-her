# Arches for HERs

## What is Arches for HERs

Arches for HERs is a comprehensive data management platform for UK Historic Environment Records (HERs). Arches for HERs is purpose-built for HERs and any organization that conforms to the standards specified by the Forum for Information Standards in Heritage (FISH), including MIDAS Heritage.

You can find out more about Arches for HERs at [https://www.archesproject.org/arches-for-hers/](https://www.archesproject.org/arches-for-hers/)

## How do I get started with Arches for HERs

If you are installing Arches for HERs for the first time, you can install it as an Arches application into a project or run it directly as an Arches project. Running Arches for HERs as a project can provide some convienience if you are a developer contributing to the Arches for HERs project. Otherwise, we strongly recommend running Arches for HERs as an Arches Application within a project because that will allow greater flexibility in customizing your project without the risk of conflicts when upgrading to the next version of Arches for HERs.

### If installing for development

Clone the arches-her repo and checkout to the latest dev/x.x.x branch. Navigate to the `arches-her` directory from your terminal and run:
      ```
      pip install -e .
      ```

Important: Installing the arches-her app will install Python dependencies including Arches. This may replace your current install of Arches with a version from PyPi. If you've installed Arches for development using the --editable -e flag, you'll need to re pip install arches after installing arches-her.

### If installing for deployment

Run `pip install arches-her`

### Project Configuration

1. If you don't already have an Arches project, you'll need to create one by following the instructions in the [Arches documentation](http://archesproject.org/documentation/).

   If you are installing Arches for HERs on Windows, be sure to follow the [instructions relating to the GDAL_LIBRARY_PATH](https://arches.readthedocs.io/en/latest/installing/installation/#create-a-project) detailed in the Installing Core Arches documentation.

2. When your project is ready, add "arches_her" to `INSTALLED_APPS` **below** the name of your project in `settings.py`.

   ```python
   INSTALLED_APPS = (
      ...
      "arches_her",
      "my_project",
   )

   INSTALLED_APPS += ("arches.app",)
   ```

3. Make sure the following settings are also added to the project's settings.py file

   ```python
   DATATYPE_LOCATIONS.append('arches_her.datatypes')
   FUNCTION_LOCATIONS.append('arches_her.functions')
   SEARCH_COMPONENT_LOCATIONS.append('arches_her.search.components')
   ```

4. Add the following optional, UK specific settings to the project's settings.py file
   ```python
   # British National Grid (BNG) and Latitude/Longitude set as preferred coordinate systems.  To revert to
   # Geographic as the preferred coordinate system, comment out the preferred coordinate system setting below

   PREFERRED_COORDINATE_SYSTEMS = (
      {
         "name": "BNG",
         "srid": "27700",
         "proj4": "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs",
         "default": True,
      },
      {"name": "LatLong", "srid": "4326", "proj4": "+proj=longlat +datum=WGS84 +no_defs", "default": False},  # Required
   )
   ANALYSIS_COORDINATE_SYSTEM_SRID = 27700  # Comment out if using LatLong/WGS84
   ```

5. If developing Arches for HERs, you'll need to add the HER_ROOT setting which indicates where on your file system your arches_her repository is located. You'll need to adjust the path according to where you have cloned the arches_her repo:

   ```python
   HER_ROOT = os.path.join(os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe()) + '../../../')), 'arches-her', 'arches_her')
   ```

6. Next update your project's urls.py file to include the Arches for HERs urls like so:

   ```python
   urlpatterns = [
      path("", include("arches.urls")),
      path("", include("arches_her.urls")),
   ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
   ```

7. Add `arches_her` as a dependency in your project's `package.json` file:

   ```json
   "dependencies": {
        "arches": "archesproject/arches#stable/7.6.0",
        "arches_her": "archesproject/arches_her#stable/1.1.x"
    },
    ```

8. Set up your database and load the package with the following command:

   ```bash
   python manage.py packages -o load_package -a arches_her -db -y
   ```

9. Start the Arches for HERs project

   ```bash
   python manage.py runserver
   ```

10. Install and build front-end dependencies

   Before you can use browse the application you will need to build the front end asset bundle. From the directory containing the package.json file ([workspace]/arches_her/arches_her)

   ```bash
   npm install
   npm run build_development
   ```

This will allow you to run your Arches project locally, but is not suitable for running on a web server. Please see the guidance for deploying an Arches project like Arches for HERs into a server environment: https://arches.readthedocs.io/en/latest/deployment/

## How Do I Configure Arches for HERs

Administrators of an instance of Arches for HERs should configure their arches project having installed the out-of-the-box version.  Ways in which you can configure and customise an instance include:

- The homepage provided (`arches_her/arches_her/templates/index.htm`) is a template that requires modification to suit the implementation. This should include branding, images, and replacing the highlighted content with appropriate information. A bespoke homepage can be created by copying the content of `arches_her/arches_her/templates/index.htm` to your arches project and modifying it.
- Configuring functions against specific graphs.  The initial installation of Arches for HERs includes the following functions:
  - BNG Point to GeoJSON function
  - GeoJSON to BNG Point function
  - Consultation Status function
  - Generate Unique References
- Branding emails sent by the application. Copy the email templates from `arches_her/arches_her/templates/emails` to your arches project and modify them as required.
- Setting Accessibility mode to be on.
- Configuring basemaps available in your Arches for HERs instance (using the instructions in the [Core Arches Documentation](https://arches.readthedocs.io/en/latest/administering/managing-map-layers/#basemaps-and-overlays)).

>❗️ Please note: you will need to configure a MapBox key in the user interface for the default mapping to appear, as per the [Default Map Settings](https://arches.readthedocs.io/en/latest/configuring/arches-system-settings/#default-map-settings) Core Arches documentation.

## Working with Letter Templates

Field tag replacement in the templates can easily break if styling changes occur within the Word documents. The internal &ldquo;style runs&rdquo; provide rich formatting for the letters, but if a style partially touches a field tag (a field name surrounded by angle brackets), the field tag is physically split across several style runs. When this happens, it is no longer possible for the field to be substituted with its data value.

It is good practice to run the docx management command after working on the letter templates and before committing to source control. The full command is:

```bash
python manage.py docx fix_style_runs --dest_dir docx
```

The `--dest_dir` parameter is optional and defaults to the `docx` folder.

The Word files in the destination folder are processed in turn, and the command looks for pairs of angle brackets that may span multiple style runs. When this happens, they are joined together, thus restoring the full field tag.

## Guidance Documentation

A number of guidance documents are available in `arches_her/media/guides` that can be used to help users understand how to use the system. These documents are in PDF format and can be linked to within your implementation if you do not have your own help documentation.

An example of how to include them within your implementation can be found in the index.htm template, which includes a link to the introduction guide.

## Project Specific Styling

For information, there are currently 2 project css/scss files for styling, this is in preparation for future scss migration:

### - project.scss

Used for the Arches-HER landing page. There are 3 other required related files: _project-breakpoints.scss, _project-functions.scss and _project-variables.scss.

### - project.css

Used for the rest of the site where the project.css is imported by the base.htm template.