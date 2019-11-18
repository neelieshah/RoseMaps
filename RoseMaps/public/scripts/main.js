/**
 * @fileoverview
 * Provides interactions for all pages in the UI.
 *
 * @author 
 * Neelie shah
 *

// /** namespace. */
var rh = rh || {};

/** globals */
rh.COLLECTION = "Schedules";
rh.KEY_SCHEDULE = "schedule";
rh.KEY_UID = "uid";
rh.KEY_LAST_TOUCHED = "lastTouched";


rh.ROSEFIRE_REGISTRY_TOKEN = "549427f6-ef22-4ccc-a188-aea309a9e772";
rh.fbAuthManager = null;
rh.fbScheduleManager = null;
rh.fbHomeManager = null;
rh.currentDocId = null;
rh.currentSchedule = null;

/* Main */
$(document).ready(() => {
	console.log("Ready");
	rh.fbAuthManager = new rh.FbAuthManager();
	rh.fbAuthManager.beginListening(() => {
		// console.log("Auth state changed. isSignedIn = ", rh.fbAuthManager.isSignIn);
		rh.checkForRedirects();
		rh.initializePage();

	});
});

rh.Schedule = class {
	constructor(id, schedule) {
		this.id = id;
		this.schedule = schedule;
	}
}

rh.FbAuthManager = class {
	constructor() {
		this._user = null;

	}
	get uid() {
		if (this._user) {
			return this._user.uid;
		}
		console.log("There is no user!");
		return "";
	}

	get isSignIn() {
		return !!this._user;
	}

	beginListening(changeListener) {
		// console.log("Listen for auth state changes");
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			changeListener();
		});
	}

	signIn() {
		// console.log("Rosefire Sign in");
		Rosefire.signIn(rh.ROSEFIRE_REGISTRY_TOKEN, (err, rfUser) => {
			if (err) {
				console.log("Rosefire error.", err);
				return;
			}
			// console.log("Rosefire login worked!", rfUser);
			firebase.auth().signInWithCustomToken(rfUser.token).then((authData) => {
				// console.log("Firebase auth worked too!");
			}, function (error) {
				console.log("Firebase auth failed.");
			});
		});
	}

	signOut() {
		// console.log('this._user :', this._user);
		firebase.auth().signOut();
	}
}

rh.LoginPageController = class {
	constructor() {
		$("#rosefireButton").click((event) => {
			rh.fbAuthManager.signIn();
		});
		$("#guestButton").click((event) => {
			window.location.href = `/searchClasses%20-%20Guest.html`;
		});
	}
}

rh.GuestPageController = class {
	constructor() {
		$("#menuSignIn").click((event) => {
			// console.log("Guest wants to login");
			window.location.href = `/`;
		});
		$("#searchButton").click((event) => {
			// console.log("Guest wants to search a class");
			const letter = $("#classLetter").val();
			const number = $("#classNumber").val();

			var pString = this.searchClass(letter, number);
			this.updateView(pString);
		});
	}


	searchClass(letter, number) {
		var s = "Please enter a valid class!";

		if (letter == 'O' && number != "") {
			if (number < 200 && number >= 100) {
				s = letter + number + " is on the lower floor of Olin Hall. It eventually connects with the second floor of Moench Hall.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the upper floor of Olin Hall. It eventually connects with the third floor of Moench Hall.";
			}
			else {
				s = "Please enter a valid class!"
			}
		}

		else if (letter == 'G' && number != "") {
			if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest academic floor of Crapo Hall. It eventually connects with the first floor of Moench Hall, specifically Moench Commons and the Mailroom.";
			}
			else if (number >= 300 && number < 400) {
				s = letter + number + " is on the highest academic floor of Crapo Hall. It eventually connects with the second floor of Moench Hall.";
			}
		}

		else if (letter == 'M' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the lowest academic floor of Meyers Hall. It eventually connects with the first floor of Moench Hall, specifically Moench Commons and the Mailroom, if you walk through the doors.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the highest academic floor of Meyers Hall.";
			}
		}

		else if (letter == 'D' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'DL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closer to Hadley but farther than the classes beginning with B. It includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closer to Hadley but farther than the classes beginning with B. It is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'E' && number != "") {
			if (number >= 100 && number < 200) {
				if (number == 104) {
					s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Crapo but farther than the classes beginning with F. This class is near the Chemistry Department and has entrances on the _2 and _1 floors.";
				}
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Crapo but farther than the classes beginning with F. If you're on the same floor as the Mailroom, go up 1 floor and head towards Crapo.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Crapo but farther than the classes beginning with F. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'FL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closest to Crapo. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closest to Crapo. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'F' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closest to Crapo. If you're on the same floor as the Mailroom, go up 1 floor and head towards Crapo.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closest to Crapo. If you're on the same floor as the Mailroom, go up 2 floors and head towards Crapo.";
			}
		}

		else if (letter == 'CL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closer to Hadley, but farther than the classes beginning with B. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closer to Hadley, but farther than the classes beginning with B. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'C' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'BL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closest to Hadley. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closest to Hadley. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'B' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closest to Hadley. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closest to Hadley. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'A' && number != "") {
			if (number >= 200 && number < 300) {
				s = letter + number + " is in the HSS hallway. Go to the top floor of Moench, walk toward Hadley, go up a small staircase and turn right. Starting from the 2nd floor of Olin, walk towards Moench.";
			}
		}

		else if (letter == 'GM' && number != "") {
			s = letter + number + " is on the GM room in lower level of Moench Hall close to the Business office.";
		}

		else if (letter == 'KIC' && number != "") {
			s = letter + number + " is in the KIC/BIC building. This building is not attatched to any of the academic buildings but can be found behind the Meyers Parking Lot";
		}

		else if (letter == 'HH' && number != "") {
			s = letter + number + " is in Hatfield Hall. This building is not attatched to any of the academic buildings but can be found to the right of the main enterance";
		}
		// console.log('s :', s);
		this.updateView(s);
		return s;
	}


	updateView(s) {
		$("#modal-body").html(s);
	}
}

rh.SearchPageController = class {
	constructor() {
		$("#menuSignOut").click((event) => {
			// console.log("Sign out.");
			rh.fbAuthManager.signOut();
		});

		$("#searchButton").click((event) => {
			// console.log("User wants to seach a class");
			const letter = $("#classLetter").val();
			const number = $("#classNumber").val();
			var pString = this.searchClass(letter, number);
			this.updateView(pString);
		});
	}


	searchClass(letter, number) {
		var s = "Please enter a valid class!";

		if (letter == 'O' && number != "") {
			if (number < 200 && number >= 100) {
				s = letter + number + " is on the lower floor of Olin Hall. It eventually connects with the second floor of Moench Hall.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the upper floor of Olin Hall. It eventually connects with the third floor of Moench Hall.";
			}
		}

		else if (letter == 'G' && number != "") {
			if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest academic floor of Crapo Hall. It eventually connects with the first floor of Moench Hall, specifically Moench Commons and the Mailroom.";
			}
			else if (number >= 300 && number < 400) {
				s = letter + number + " is on the highest academic floor of Crapo Hall. It eventually connects with the second floor of Moench Hall.";
			}
		}

		else if (letter == 'M' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the lowest academic floor of Meyers Hall. It eventually connects with the first floor of Moench Hall, specifically Moench Commons and the Mailroom, if you walk through the doors.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the highest academic floor of Meyers Hall.";
			}
		}

		else if (letter == 'D' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'DL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closer to Hadley but farther than the classes beginning with B. It includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closer to Hadley but farther than the classes beginning with B. It is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'E' && number != "") {
			if (number >= 100 && number < 200) {
				if (number == 104) {
					s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Crapo but farther than the classes beginning with F. This class is near the Chemistry Department and has entrances on the _2 and _1 floors.";
				}
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Crapo but farther than the classes beginning with F. If you're on the same floor as the Mailroom, go up 1 floor and head towards Crapo.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Crapo but farther than the classes beginning with F. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'FL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closest to Crapo. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closest to Crapo. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'F' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closest to Crapo. If you're on the same floor as the Mailroom, go up 1 floor and head towards Crapo.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closest to Crapo. If you're on the same floor as the Mailroom, go up 2 floors and head towards Crapo.";
			}
		}

		else if (letter == 'CL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closer to Hadley, but farther than the classes beginning with B. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closer to Hadley, but farther than the classes beginning with B. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'C' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'BL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closest to Hadley. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closest to Hadley. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'B' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closest to Hadley. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closest to Hadley. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'A' && number != "") {
			if (number >= 200 && number < 300) {
				s = letter + number + " is in the HSS hallway. Go to the top floor of Moench, walk toward Hadley, go up a small staircase and turn right. Starting from the 2nd floor of Olin, walk towards Moench.";
			}
		}

		else if (letter == 'GM' && number != "") {
			s = letter + number + " is on the GM room in lower level of Moench Hall close to the Business office.";
		}

		else if (letter == 'KIC' && number != "") {
			s = letter + number + " is in the KIC/BIC building. This building is not attatched to any of the academic buildings but can be found behind the Meyers Parking Lot";
		}

		else if (letter == 'HH' && number != "") {
			s = letter + number + " is in Hatfield Hall. This building is not attatched to any of the academic buildings but can be found to the right of the main enterance";
		}
		// console.log('s :', s);
		this.updateView(s);
		return s;
	}

	updateView(s) {
		$("#modal-body").html(s);
	}
}

rh.SchedulePageController = class {
	constructor() {

		// rh.fbScheduleManager.populateSchedule();
		$("#menuSignOut").click((event) => {
			// console.log("Sign out.");
			rh.fbAuthManager.signOut();
		});
		$("#saveSchedule").click((event) => {
			this.schedule = [];
			for (let k = 0; k < 50; k++) {
				var name = "#class-" + (k + 1);
				if ($(name).val() != "") {
					this.schedule[k] = $(name).val();
				}
				else {
					this.schedule[k] = "-";
				}
			}
			rh.fbScheduleManager.updateSchedule(this.schedule);
		});

	}
}

rh.FbScheduleManager = class {
	constructor() {
		// var docId = null;
		var that = this;
		this._ref = null;
		// this._schedule = null;
		firebase.firestore().collection(rh.COLLECTION).get().then(function (querySnapshot) {
			querySnapshot.forEach(function (doc) {
				if (doc.data().uid == rh.fbAuthManager.uid) {
					that._ref = firebase.firestore().collection(rh.COLLECTION).doc(doc.id);
					// that._schedule = doc.data().schedule;
				}
			});
		});

		this._document = {};
		this._unsubscribe = null;
	}

	beginListening(changeListener) {
		// console.log("Listening for this schedule quote");
		this._unsubscribe = this._ref.onSnapshot((doc) => {
			if (doc.exists) {
				this._document = doc;
				// console.log('doc.data() :', doc.data());
				if (changeListener) {
					changeListener();
				}
			} else {
			}
		});
	}

	stopListening() {
		this._unsubscribe();
	}

	updateSchedule(schedule) {
		this._ref.update({
			[rh.KEY_SCHEDULE]: schedule,
			[rh.KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			[rh.KEY_UID]: rh.fbAuthManager.uid,
		}).then((docRef) => {
			// console.log("Document has been updated.");
		}).catch((error) => {
			console.log("There was an error updating the document", error);
		});
	}

	// populateSchedule() {
	// 	for (let k = 0; k < 50; k++) {
	// 		var name = "#class-" + (k + 1);
	// 		if (this._schedule[k] != "-") {
	// 			$(name).html(this._schedule[k]);
	// 		}
	// 	}
	// }

	delete() {
		return this._ref.delete();
	}

	get uid() {
		return this._document.get(rh.KEY_UID);
	}

	get schedule() {
		return this._document.get(rh.KEY_SCHEDULE);
	}
}

rh.HomePageController = class {
	constructor() {
		$("#menuSignOut").click((event) => {
			// console.log("Sign out.");
			rh.fbAuthManager.signOut();
		});
	}
}

rh.FbHomeManager = class {
	constructor() {
		this.updateView();
	}

	updateView() {
		this.updateHeader();
		this.checkIfNewUser();
	}

	updateHeader() {
		$("#userHeader").html(rh.fbAuthManager.uid + "'s Class Schedule");
	}

	checkIfNewUser() {
		var that = this;
		firebase.firestore().collection(rh.COLLECTION).get().then(function (querySnapshot) {
			// console.log("im checking to see if there is a new user...");
			querySnapshot.forEach(function (doc) {
				if (doc.data().uid == rh.fbAuthManager.uid) {
					that.setNewVars(doc.id, doc.data().schedule);
					// console.log("There is a match! Here is their info...");
					// console.log('doc.data().uid :', doc.data().uid);
					// console.log('doc.data().schedule :', doc.data().schedule);
					// console.log('rh.currentDocId :', rh.currentDocId);
					that.readSchedule(rh.currentSchedule);

				}
			});

			if (rh.currentDocId == null) {
				// console.log("There was no match, I'm creating a new user...");
				var newSchedule = [];
				for (let k = 0; k < 50; k++) {
					newSchedule[k] = "-";
				}
				that.createNewUser(newSchedule);
			}
		});
	}


	readSchedule(currentSchedule) 
	{
		let length = currentSchedule.length;
		let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
		let times = ["8:00","9:00","10:00","11:00","12:00","1:00","2:00","3:00","4:00","5:00",];
		$("#modal-body").append("<b>"+"DAILY ROUTE"+"</b>"+": ");
		for (let k = 0; k < length; k++) {
			var name = "#class-" + (k + 1);
			$(name).html(currentSchedule[k])
			console.log('k%10 :', k%10);
			if(k%10 == 0)
			{
				console.log('here :', days[k/10]);
				$("#modal-body").append("<br><b><u>"+days[k/10]+"</u><b><br>");
			}
			if(currentSchedule[k] != "-")
			{
				$("#modal-body").append("<u>"+times[k%10]+"</u>"+": "+this.findDirections(currentSchedule[k])+"<br><br>");
			}
		}
		
	}
	findDirections(str)
	{
		var res = str.substring(str.indexOf("in")+3);
		if(res == null)
		{
			return (str+" is not valid.");
		}
		var letter = null;
		var num = null;
		if(res.length == 5)
		{
			letter = res.substring(0,2);
			num = res.substring(2);
		}
		
		else if(res.length == 4)
		{
			letter = res.substring(0,1);
			num = res.substring(1);
		} 

		else{
			return (str+" is not valid.");
		}
		
		return this.createStr(letter, num);

	}

	createStr(letter, number)
	{
		let s = "";
		if (letter == 'O' && number != "") {
			if (number < 200 && number >= 100) {
				s = letter + number + " is on the lower floor of Olin Hall. It eventually connects with the second floor of Moench Hall.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the upper floor of Olin Hall. It eventually connects with the third floor of Moench Hall.";
			}
			else {
				s = "Please enter a valid class!"
			}
		}

		else if (letter == 'G' && number != "") {
			if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest academic floor of Crapo Hall. It eventually connects with the first floor of Moench Hall, specifically Moench Commons and the Mailroom.";
			}
			else if (number >= 300 && number < 400) {
				s = letter + number + " is on the highest academic floor of Crapo Hall. It eventually connects with the second floor of Moench Hall.";
			}
		}

		else if (letter == 'M' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the lowest academic floor of Meyers Hall. It eventually connects with the first floor of Moench Hall, specifically Moench Commons and the Mailroom, if you walk through the doors.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the highest academic floor of Meyers Hall.";
			}
		}

		else if (letter == 'D' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'DL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closer to Hadley but farther than the classes beginning with B. It includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closer to Hadley but farther than the classes beginning with B. It is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'E' && number != "") {
			if (number >= 100 && number < 200) {
				if (number == 104) {
					s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Crapo but farther than the classes beginning with F. This class is near the Chemistry Department and has entrances on the _2 and _1 floors.";
				}
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Crapo but farther than the classes beginning with F. If you're on the same floor as the Mailroom, go up 1 floor and head towards Crapo.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Crapo but farther than the classes beginning with F. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'FL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closest to Crapo. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closest to Crapo. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'F' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closest to Crapo. If you're on the same floor as the Mailroom, go up 1 floor and head towards Crapo.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closest to Crapo. If you're on the same floor as the Mailroom, go up 2 floors and head towards Crapo.";
			}
		}

		else if (letter == 'CL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closer to Hadley, but farther than the classes beginning with B. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closer to Hadley, but farther than the classes beginning with B. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'C' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closer to Hadley but farther than the classes beginning with B. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'BL' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the second lowest floor of Moench Hall, closest to Hadley. This floor includes Moench Commons and the Mailroom as well as many Physics and Optical Engineering Labs.";
			}
			else if (number >= 200 && number < 300) {
				s = letter + number + " is on the lowest floor of Moench Hall, closest to Hadley. This floor is below Moench Commons and the Mailroom near the Mechanical Engineering Machine Shop.";
			}
		}

		else if (letter == 'B' && number != "") {
			if (number >= 100 && number < 200) {
				s = letter + number + " is on the 3rd out of 4 floors of Moench, closest to Hadley. If you're on the same floor as the Mailroom, go up 1 floor and head towards Hadley.";
			}
			else if (number >= 200 && number <= 300) {
				s = letter + number + " is on the 4th and highest floor of Moench, closest to Hadley. If you're on the same floor as the Mailroom, go up 2 floors and head towards Hadley.";
			}
		}

		else if (letter == 'A' && number != "") {
			if (number >= 200 && number < 300) {
				s = letter + number + " is in the HSS hallway. Go to the top floor of Moench, walk toward Hadley, go up a small staircase and turn right. Starting from the 2nd floor of Olin, walk towards Moench.";
			}
		}

		else if (letter == 'GM' && number != "") {
			s = letter + number + " is on the GM room in lower level of Moench Hall close to the Business office.";
		}

		else if (letter == 'KIC' && number != "") {
			s = letter + number + " is in the KIC/BIC building. This building is not attatched to any of the academic buildings but can be found behind the Meyers Parking Lot";
		}

		else if (letter == 'HH' && number != "") {
			s = letter + number + " is in Hatfield Hall. This building is not attatched to any of the academic buildings but can be found to the right of the main enterance";
		}
		return s;
	}
	createNewUser(schedule) {
		firebase.firestore().collection(rh.COLLECTION).add({
			[rh.KEY_SCHEDULE]: schedule,
			[rh.KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
			[rh.KEY_UID]: rh.fbAuthManager.uid,
		}).then((docRef) => {
			// console.log("User has been added with id", docRef.id);
			rh.currentDocId = docRef.id;
		}).catch((error) => {
			console.log("There was an error adding the document", error);
		});
		this.readSchedule(schedule);
	}

	setNewVars(id, schedule) {
		rh.currentDocId = id;
		// console.log('rh.currentDocId :', rh.currentDocId);
		rh.currentSchedule = schedule;
	}

	getDocId() {
		return rh.currentDocId;
	}
}

rh.checkForRedirects = function () {
	if ($("#login-page").length && rh.fbAuthManager.isSignIn) {
		window.location.href = "/userHome.html";
		console.log("redirecting to home page...");
	}
}

rh.initializePage = function () {
	// var urlParams = new URLSearchParams(window.location.search);
	if ($("#guest-page").length) {
		// console.log("On the guest search page");
		new rh.GuestPageController();
	}
	else if ($("#search-page").length) {
		// console.log("On the user search page");
		new rh.SearchPageController();
	}
	else if ($("#schedule-page").length) {
		// console.log("On the schedule page");
		rh.fbScheduleManager = new rh.FbScheduleManager();
		new rh.SchedulePageController();
	}
	else if ($("#user-page").length) {
		// console.log("On the user home page");
		rh.fbHomeManager = new rh.FbHomeManager();
		new rh.HomePageController();
	}

	else if ($("#login-page").length) {
		// console.log("On the login page.");
		new rh.LoginPageController();
	}
	else {
		console.log("You're lost!");
	}
}

rh.setVars = function () {

}