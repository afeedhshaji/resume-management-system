### Step 1 - Node Modules

The first thing you need to do to get this app working is to install the Node modules with the following command:

    npm install

### Step 2 - Running the App

    npm start

It will start the Node back end server at http://localhost:3035, with Nodemon, so that updates happen automatically on save. 

### Candidate registration form

    http://localhost:3035/api/candidate/
    
### Other api end points

To view all the users : 

    http://localhost:3035/api/candidate/list [GET]


To edit the user : 

    http://localhost:3035/api/candidate/edit/:id [GET]
   
### Mongodb (Bash):
`mongo`<br />
`use resume-system`<br />
`show tables`<br />

### Docker Run

```bash
# Run in Docker
docker-compose up
# use -d flag to run in background
```

```bash
# Tear down
docker-compose down
```

```bash
# To be able to edit files, add volume to compose file
volumes: ['./:/usr/src/app']
```

```bash
# To re-build
docker-compose build
```

