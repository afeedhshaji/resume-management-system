### Setup:
- `npm install`
- `npm start` to run dev server

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Postman
- Post `localhost:5000/api/candidate/register` a sample json data in Postman

After sending the post request, the database can be viewed in mongodb using command line or mongodb GUI(Compass app).

Sample Json
```
{
	"name": "John Doe",
	"email": "john.do1e@gmail.com",
	"position": "HR Consultant",
	"experience": 5,
	"qualification": "B.Tech",
	"candidateRating": 7.5,
	"salary": 300000,
	"phone": "8585959510",
	"companiesWorked": ["Infosys", "TCS", "Cognizant"],
	"skills" : ["Python", "Django", "Express"],
	"interviewFeedback": "Good communication skill and hard working",
	"resumeURL" : "https: //lycaeum-static.s3.amazonaws.com/media/B170282CS_resume"
}
```

### To view the mongodb database:

#### Bash (Commandline):
`mongo`<br />
`use resume-system`<br />
`show tables`<br />
