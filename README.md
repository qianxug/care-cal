# careCal
## Inspiration
The idea for careCal began as a passionate car conversation about, quite simply, WHY so many people refuse to wear sunscreen despite knowing the clear risks. This evolved into a discussion about a general lack of consistency in skincare and the role of simple and effective planners in that respect. Finding that a traditional calendar was very tedious, we sought to create a simple journal that recorded events by action rather than time with the hope of making this process much faster, smoother, and more informed. The end goal is an environment where people can connect with responsible sources for their health and make this very important lifestyle less daunting.

## What it does
careCal is a simple-to-use skincare planning app that primarily targets those with high-maintenance skin conditions such as acne to map out their day-to-day skincare routines based on weather conditions and dermatologist recommendations. What differentiates careCal from a regular calendar is it schedules each week based on product routine rather than laboriously filling each day, two times per day, indivually with products. At the same time, it serves as a sarcastic yet important reminder to wear and reapply sunscreen for all.

## Select features are:

Addition of skincare products in use and expected weekly schedule into personal profile
Fully-integrated weather data (e.g. humidity, UV index) in calendar widget
Automated sunscreen re-application reminders
Automated compilation of morning/night skincare routines based on inputted products
Option to export as .ics into preferred Calendar app
Option to link dermatologist profiles and profiles of patients under their care
How we built it
The front-end of careCal is built in React using Ant Design components and icons. The calendar widget is based off of the React FullCalendar, and routing and navigation are handled using the react-router-dom library.

In the back end, Authentication is handled through Firebase, and MongoDB is used for storing all non-auth related user data. This involves a User ID that can be used in the future to add health providers and product information so it can be accessed anywhere at anytime.

## Challenges we ran into
Coming into the project, both team members had little to no familiarity with most of the frameworks and technologies used. Qianxu, who worked on the front-end, found handling with the asynchronous nature of React state updates awkward. Leo, who worked mainly on the back-end and styling, had never completed a web development project. A large challenge that had to be overcome was adopting the mindset of web developers and understanding how information is communicated asynchronously across these interfaces. A lot of creativity went into creating useful, convenient, and elegant designs that incentivizes user interaction.

## Accomplishments that we're proud of
Implementing Firebase Authentication
Setting MongoDB + Express.js backend environment
Producing a well thought out app that prioritizes simple yet good user features
Sleeping -2 hours / remaining sane when learning React (cry)
What we learned
MetHacks was, overall, a stressful yet rewarding experience to delve into building with new technologies and really challenged both team members to research & debug efficiently, make sound tradeoffs, and be resourceful.

## What's next for careCal
Existing JavaScript APIs for exporting calendar events into .ics can only do so on an event-by-event basis, and the team did not have time to write custom APIs to handle exporting series of events. Thus, the first step is to fully implement this feature (likely, given more time, using an additional Python back-end) and configure it such that, when the Export button is pressed, an email containing a singular .ics file with all events will be sent out to the user. Also, the team would like to implement an interface for care providers (e.g. dermatologists), who will have direct access to their clients' profiles and will be able to make changes/recommendations based on their current skin conditions. Currently we have the keys and toggles that can be used to do this, however, more time would be needed to build this secure platform. We initially also wanted to use webscraping to collect information from websites such as inciDecoder to import ingredients and warning/use cases. This unfortunately could not be well-implemented during the hacking time but is a future feature users can look forward to.

## Built With
css3 | express.js | firebase | html5 | javascript | mongodb | node.js | npm | react
