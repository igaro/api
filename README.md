#Igaro Api [http://api.igaro.com](http://api.igaro.com)

Igaro Api is a NodeJS powered API server which drives dynamic content into Igaro App.

This software is under development and should not be used at this time.

* Drives routes (model/views) and styles into Igaro App.
* Features users, usergroups, securitygroups, sections, resources, content, surveys and forums.
* Military grade security throughout.
* Extensive administration, workflow and content management tools.
* SQL DBMS based with transaction management.

Getting Started

Clone the repo.
npm install
Launch Grunt. Servers will start on 2006 (debug) and 2007 (deploy).

Clone the Igaro App repo and add an 'api' key containing 'http://localhost:2006' to the index.html file config.

<app>/compile/cdn/js/conf.app.js

The following contains code which can be inserted into your conf.app.js file to customise app behaviour.

Configuration

Pull data from the api using /init. This data is furnished by <api>/config/app.conf.js

Routing

Install a new provider using the following code;

Credentials

Install a new 401 handler using the following code;


