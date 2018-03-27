/*
 *	Heart of the Valley 
 *		main.js
 */

// This will let you use the .remove() function later on
if (!('remove' in Element.prototype)) {
	Element.prototype.remove = function() {
		if (this.parentNode) {
			this.parentNode.removeChild(this);
		}
	};
}

mapboxgl.accessToken = 'pk.eyJ1IjoieWNob3kiLCJhIjoiY2pmOTYwdzZ5MG52dDJ3b2JycXY4ZDU5ciJ9.m9H_Mqu1b42AObg_u_tjpA';

// Initialize a new map in the div with id 'map'
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v9',
	center: [-121.893028, 37.335480],  // position in long, lat format
	zoom: 12,
	dragPan: true, // If true , the "drag to pan" interaction is enabled (see DragPanHandler)
	trackResize: true, // If true, the map will automatically resize when the browser window resizes.
	doubleClickZoom: true, //If true double click will zoom
	keyboard: true //If true will enable keyboard shortcuts
});


	var art = {
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8968265,
						37.3357211
					]
				},
				"properties": {
					"title": "Afternoon",
					"description": "'Afternoon' depicts a grandmother watching over a boy playing flute.",
					"image": "https://static1.squarespace.com/static/5681ee28841abae3b7d8dec9/5681f5521c12101f97a4de89/5849d43ce58c620b5971f8da/1489697022793/Afternoon+for+website.jpg",
					"artist": "Sainer",
					"address": "87 N Almaden Blvd",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at N Almaden Blvd and W St John St.",
					"postalCode": "95110",
					"state": "CA"
				},
			},
			{
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
					 -121.8884402,
					 37.3306112
				 ]
			 },
			 "properties": {
				 "title": "Anno Domini Collage",
				 "image": "img/AnnoDominiMural_photoby_YanYinChoy.jpg",
				 "artist": "Carolyn Ryder Cooley (New York) & Lena Wolff (California); Daniel Jesse Lewis (California); Jessie Rose Vala (New Mexico); David Choe (California); Bruno 9Li (Brazil); Klone (Israel); Adrian Lee (California); Know Hope (Israel)",
				 "address": "366 S 1st St.",
				 "city": "San José",
				 "country": "United States",
				 "postalCode": "95113",
				 "state": "CA"
			 }
		 },
		 {
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
					 -121.8958982,
					 37.3199604
				 ]
			 },
			 "properties": {
				 "title": "Aztec Calendar Mural",
				 "image": "https://s3.amazonaws.com/gs-waymarking-images/3808c90d-8d96-4b81-8309-3b22b803bbfb.JPG",
				 "description": "This large mural featuring an Aztec Calendar covers one entire wall surface of the handball wall. One of the walls includes the following text from the artist: In order to move onward into the future you must know about your past. In order to know your past you must read and study about it. In order to succeed in Life you must go to school. And in order to go and stay in school you must desire it. In order to desire anything, you must ask yourself, 'What do I want to do for my familia and for myself? Anything can be taken from you except knowledge, Knowledge stays with you until the very end. La Raza Unida.",
				 "artist": "Antonio Torres",
				 "address": "450 W Virginia St.",
				 "city": "San José",
				 "country": "United States",
				 "postalCode": "95125",
				 "state": "CA"
			 }
		 },
		 {
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
					 -121.8815958,
					 37.3357633
				 ]
			 },
			 "properties": {
				 "title": "César E. Chávez Monument: The Arch of Dignity, Equality, and Justice",
				 "image": "img/CesarChavezMonument_by_JudithBaca_photoby_yanyinchoy-COLLAGE.jpg",
				 "description": "The Cesar E. Chavez Monument was unveiled at San José State University in 2008. Artist and designer Judith F. Baca shares: <br/> “May all those passing through it experience the passage from hope and inspiration, to education, and finally, to action for social and environmental justice.” <br/><br/>To learn more <a href='http://digitalmurallab.com/dml/the-cesar-chavez-monument-is-unveiled-in-san-jose-state-university/'  target='_blank'>go here.</a>",
				 "artist": "Judith F. Baca",
				 "address": "San José State University, 1 Washington Sq.",
				 "city": "San José",
				 "country": "United States",
				 "postalCode": "95192",
				 "state": "CA"
			 }
		 },
		 {
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
						 -121.8155584,
						 37.3255328
				 ]
			 },
			 "properties": {
				 "title": "Eastridge Mall Mural - Aaron De La Cruz",
				 "description": "Aaron De La Cruz writes: <br/> “I remembered taking trips with my Grandmother to the Fulton Mall (located in Downtown Fresno, CA) back in the mid 1980’s. The exterior of the mall had a water feature that ran through the walkway, connecting all the stores. There were many large scale sculptures and water fountains throughout. At the time, I didn’t pay attention to the artwork I was being exposed to, but it did capture my attention. What I’m trying to get at is, I recently found out that one of those sculptures was created by artist Pierre Auguste Renoir and is the only one in the world that the public can actually touch. I liked the idea that this work of art that some would consider inaccessible, was placed where some people could care less about it. I then started to think about all of the large public art pieces I was exposed to as a youth and how I remember thinking, “How could a person create something of that scale with their hands?” I happily accepted the offer, and here is the result.”",
				 "artist": "Aaron De La Cruz",
				 "biography": "Aaron De La Cruz's work, though minimal and direct at first, tends to overcome barriers of separation and freely steps in and out of the realms of painting and design. The act and the marks themselves are very simple but tend to take on distinct and sometimes higher meanings in the broad range of mediums and contexts they appear in and on. His work finds strengths in the reduction of his interests in life to minimal information. De La Cruz gains from the idea of exclusion, just because you don't literally see it, doesn't mean that it's not there.",
				 "image": "https://static1.squarespace.com/static/53ac662be4b073e1bdee6d0b/57a36d0f29687fa31c429489/591a8ae99f7456bde4022827/1494911729867/ADLC_EASTRIDGE_2017.png",
				 "website": "http://www.aarondelacruz.com/",
				 "address": "2200 Eastridge Loop",
				 "city": "San José",
				 "country": "United States",
				 "crossStreet": "at Eastridge Loop",
				 "postalCode": "95122",
				 "state": "CA"
			 }
		 },
		 {
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
						 -121.8155584,
						 37.3255328
				 ]
			 },
			 "properties": {
				 "title": "Eastridge Mall Mural - Brendan Monroe",
				 "artist": "Brendan Monroe",
				 "biography": "Brendan Monroe was born in Santa Barbara and studied at Art Center in Pasadena. The works of Monroe, a sculptor and painter, are available in California and at Galerie L.J. in Paris, and have been exhibited in Asia, Europe and North America.",
				 "address": "2200 Eastridge Loop",
				 "city": "San José",
         "image": "https://static1.squarespace.com/static/587f1c3ca5790a8424115faa/5a5c540a8165f5ec9dee07fe/5a5c56c9ec212d764f015103/1516000986053/IMG_0490-edit.jpg?format=750w",
				 "country": "United States",
				 "crossStreet": "at Eastridge Loop",
				 "postalCode": "95122",
				 "state": "CA"
			 }
		 },
		 {
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
						 -121.8155584,
						 37.3255328
				 ]
			 },
			 "properties": {
				 "title": "Eastridge Mall Mural - Cyrcle",
				 "image": "http://mms.businesswire.com/media/20170608006227/en/591679/4/Money_Shot_Cyrcle_small.jpg",
				 "artist": "Cyrcle",
				 "biography": "CYRCLE is a two-man collective composed of David Leavitt (Davey Detail) and David Torres (Rabi) – both born in L.A. Their works can be seen all over the world and are in public and private collections including that of Shepard Fairey, Ari Emanuel, Sean Combs, and the MGM Grand in Las Vegas.",
				 "website": "http://www.cyrcle.com/",
				 "address": "2200 Eastridge Loop",
				 "city": "San José",
				 "country": "United States",
				 "crossStreet": "at Eastridge Loop",
				 "postalCode": "95122",
				 "state": "CA"
			 }
		 },
		 {
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
						 -121.8155584,
						 37.3255328
				 ]
			 },
			 "properties": {
				 "title": "Eastridge Mall Mural - Lila Gamellos",
				 "description": "Lila Gamellos writes: For me, these all represent different sides of San José. What I think San José as well as, if not more so, East San José and Evergreen need some identity and a little confidence boost.  San Jose is awesome.  Why is it only the Sharks we boast?  What the world needs is love, so let’s start that at home.  I’ve wrapped my W shaped area with overwhelming displays of San Jose affection, past and present.",
				 "image": "http://www.gemellosmurals.com/wp-content/uploads/2015/02/20170530_13322886801-768x334.jpg",
				 "artist": "Lila Gamellos",
				 "website": "http://www.gemellosmurals.com/",
				 "biography": 'Born, raised and trained in San José, Lila Gemellos started her own business over 7 years ago as a Mural artist. With over 25 years of training, Gemellos employs different styles confidently while distinguishing herself as a visual story teller and a local creative force. Gemellos brings her strong San José roots to her artistic narratives whenever possible. Gemellos creates new relationships between Art, Business and Technology – finding opportunities to publicize a Corporation’s good will or generate more traffic to a shopping center with hashtags and inspired photography. Lila prides herself in being the bringer of unicorns – making the clients’ vision come to life by listening and continuously asking how to make the mural more meaningful. Gemellos now looks to take her inspired narratives to the public art scene in the Bay Area.',
				 "address": "2200 Eastridge Loop",
				 "city": "San José",
				 "country": "United States",
				 "crossStreet": "at Eastridge Loop",
				 "postalCode": "95122",
				 "state": "CA"
			 }
		 },
		 {
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
					 -121.8914073,
					 37.3474999
				 ]
			 },
			 "properties": {
				 "title": "Empty Vessel",
				 "image": "https://static1.squarespace.com/static/5681ee28841abae3b7d8dec9/5681f5521c12101f97a4de89/5681fe25df40f38ac4314206/1455301676987img_9258.jpg",
				 "artist": "Andrew Schoultz",
				 "website": "http://www.andrewschoultz.com/",
				 "biography": "Andrew Schoultz combines meticulous rendering with imagery both familiar and fantastical. Themes of chaos and destruction forewarn current political and environmental climate, taking form in large-scale installations, murals, paintings, sculptures, and works on paper.",
				 "address": "256 E Empire St.",
				 "city": "San José",
				 "country": "United States",
				 "crossStreet": "at 6th St and E Empire St near the train tracks",
				 "postalCode": "95112",
				 "state": "CA"
			 }
		 },
			{
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
					 -121.8780478,
					 37.333793
				 ]
			 },
			 "properties": {
				 "title": "Dolores Huerta Mural",
				 "image": "img/DoloresHuertaMuralatSJSUCommunityGarden_by_TomDyer_photoby_ASCCCAC.png",
				 "artist": "Tom Dyer",
				 "address": "327 E San Salvador St.",
				 "city": "San José",
				 "country": "United States",
				 "postalCode": "95112",
				 "state": "CA"
			 }
		 },
		 {
			 "type": "Feature",
			 "geometry": {
				 "type": "Point",
				 "coordinates": [
					 -121.856375,
					 37.352768
				 ]
			 },
			 "properties": {
				 "title": "Doña Mayfair",
				 "image": "img/DonaMayfair_by_SamRodriguez_photoby_SamRodriguez.jpeg",
				 "artist": "Sam Rodriguez",
				 "description": "Sam Rodriguez shares: <br/> “I was really excited and proud to participate in this project as East San José, is where my family is rooted. The focus on this mural was the Mayfair neighborhood where the inspiring leader César Chávez once lived. This area was known as 'Sal Si Puede' (leave if you can), a twist on the United Farm Workers campaign slogan 'Si Se Puede' (Yes You Can). Though rich in culture, it's residents, mostly Mexican and other Latino groups, have historically experienced income, and justice inequality along with negative press. Today, it is good to see positive movement blooming throughout the area, as many grassroots efforts are being made to push East San José more toward a 'Si Se Puede' environment.” <a href='http://celebratemayfair.org/dona-mayfair/' target='_blank'>Learn more.</a>",
				 "website": "http://samrodriguezart.com/",
				 "biography": "Sam Rodriguez is an artist based out of San José, CA and have been fortunate to have had shown his work in public art spaces, museums, companies, galleries, internet, and editorial publications. For a number of years he was self-taught through the graffiti scene, until he later decided to expand his studies by pursuing a Bachelor in Fine Arts from California College of the Arts.  He has since blended what he absorbed from both experiences to create his current style.  At the moment, he is interested in two types of portraiture that he calls, 'Topographical Portraiture' and 'Type Faces'.  Topographical Portraits, are made by stylizing a portrait with topographical lines and shapes in a similar manner to those found through images on geographic maps. Type Faces, incorporate typography and portraiture. He developed these through countless studio sessions, to use as a platform for his interest in social, historic, and cultural hybridity.",
				 "address": "1700 Alum Rock Avenue",
				 "city": "San José",
				 "country": "United States",
				 "crossStreet": "at Alum Rock Ave and King Rd",
				 "postalCode": "95116",
				 "state": "CA"
			 }
		 },
		 {
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [
					-121.8879794,
					37.3303372
				]
			},
			"properties": {
				"title": "Guardian Tiger",
				"image": "http://78.media.tumblr.com/819cf134daec2cf3f7d2cf3c2e64dd29/tumblr_o29cseYH1a1qatyzbo1_1280.jpg",
				"artist": "Michael Borja",
				"website": "http://mikeborja.tumblr.com/",
				"biography": "Mike Borja grew up in San José and studied New Media and Fine Art at the AAU in San Francisco. He loves creating visual art and thinking about concepts and ideas. When he was a little kid he would mix all sorts of liquids in a cup hoping a dragon would magically appear. Now, Mike mixes paint and other materials for other beautiful things to magically appear.",
				"address": "396 S 1st St.",
				"city": "San José",
				"country": "United States",
				"postalCode": "95113",
				"state": "CA"
			}
		},
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [
					-121.8957534,
					37.334517
				]
			},
			"properties": {
				"title": "Harts Dog Park Mural",
				"image": "https://static1.squarespace.com/static/5681ee28841abae3b7d8dec9/5681f5521c12101f97a4de89/582cafaf20099ed10677b69f/1481233516902/Untitled.jpg",
				"artist": "Roan Victor",
				"website": "https://www.instagram.com/roanvictor/",
				"address": "194 W Santa Clara St.",
				"city": "San José",
				"country": "United States",
				"crossStreet": "at W Santa Clara St and Almaden Ave",
				"postalCode": "95113",
				"state": "CA"
			}
		},
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [
					-121.8921222,
					37.3484772
				]
			},
			"properties": {
				"title": "Here & There",
				"image": "https://static1.squarespace.com/static/5681ee28841abae3b7d8dec9/5681f5521c12101f97a4de89/597287b3cf81e0735c416082/1500678068733/7.jpg",
				"description": "Likening the murals to journalism, Sam Rodriquez says, 'When I think of murals, I think of outdoor books. This recent wall marks the first of many that I plan to do, which would depict the cultural landscape of San José through observations and interviews of its residents. This will result in pieces that could only be found in San José.' Rodriquez was assisted in the execution of the wall by community volunteers. 'A lot of the people who helped out cared as much, if not more, about the painting than I did,” the artist says. 'They held up the standards as I would for my own paintings.' Some of the youth involved in an intervention program (Teaching Adolescents Skills in the Community), who worked on the mural, came back after the mural was finished and proudly showed family members their work.",
				"artist": "Sam Rodriguez",
				"website": "http://samrodriguezart.com/",
				"biography": "Sam Rodriguez is an artist based out of San José, CA and have been fortunate to have had shown his work in public art spaces, museums, companies, galleries, internet, and editorial publications. For a number of years he was self-taught through the graffiti scene, until he later decided to expand his studies by pursuing a Bachelor in Fine Arts from California College of the Arts.  He has since blended what he absorbed from both experiences to create his current style.  At the moment, he is interested in two types of portraiture that he calls, 'Topographical Portraiture' and 'Type Faces'.  Topographical Portraits, are made by stylizing a portrait with topographical lines and shapes in a similar manner to those found through images on geographic maps. Type Faces, incorporate typography and portraiture. He developed these through countless studio sessions, to use as a platform for his interest in social, historic, and cultural hybridity.",
				"address": "349 E Empire St.",
				"city": "San José",
				"country": "United States",
				"crossStreet": "at N 8th St and E Empire St.",
				"postalCode": "95112",
				"state": "CA"
			}
		},
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [
					-121.8902825,
					37.3376642
				]
			},
			"properties": {
				"title": "Homage",
				"description": "This mural is a tribute to John Carlos and Tommie Smith’s famous black power salute at the 1968 Olympics.",
				"image": "img/Homage_by_ChrisDuncan_PaulUrich_photoby_yanyinchoy.jpg",
				"artist": "Chris Duncan and Paul Urich",
				"address": "135 E Santa Clara St.",
				"city": "San José",
				"country": "United States",
				"crossStreet": "at E Santa Clara St and N 4th St.",
				"postalCode": "95112",
				"state": "CA"
			}
		},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8833868,
						37.3392621
					]
				},
				"properties": {
					"title": "Interview with an Icon",
					"image": "http://ww2.kqed.org/arts/wp-content/uploads/sites/2/2016/06/IanYoung_CLakey.jpg",
					"description": "This mural features six, present-day barbers servicing the lustrous locks of six,multicultural icons in their youth. Barber Jaisen Spencer combs the hair of Fela Kuti, the late Nigerian Afrobeat music pioneer and human rights activist. Dave Diggs gives a haircut to Muhammad Ali, late American professional boxer and activist. Mark Maxx, straight-razor shaves Johnny Cash, late American singer-songwriter, guitarist, actor, and author. Alfonzo Jordan cuts the mane of Bruce Lee, late Hong Kong and American actor, film director, martial artist, martial arts instructor, philosopher and founder of the martial art Jeet Kune Do. Ian Young cuts the short ‘fro of Maya Angelou, late American poet, memoirist, and civil rights activist. Amin Munye works on famed musician Carlos Santana's mustache.",
					"artist": "Ian Young",
					"website": "http://quietgiantdesign.com/",
					"biography": "I create captivating visual concepts from scratch. I produce graphic, branding, illustration, hair and just about any other design you can think of.",
					"address": "332 E. Santa Clara St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "E Santa Clara Street between S 7th and S 8th Street",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8953685,
						37.3401058
					]
				},
				"properties": {
					"title": "Labor of Our Love",
					"image": "https://ww2.kqed.org/arts/wp-content/uploads/sites/2/2016/06/GalenOback_CLakey.jpg",
					"artist": "Galen Oback",
					"address": "260 N 1st St.",
					"biography": "Bay Area Artist, Muralist. Doing art by the bay. Commissions/Inquiries: galen.oback@gmail.com",
					"website": "https://www.instagram.com/galenobackart/",
					"country": "US",
					"city": "San José",
					"country": "United States",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8978591,
						37.3480803
					]
				},
				"properties": {
					"title": "Little Moment",
					"artist": "NoseGo",
					"image": "https://static1.squarespace.com/static/5681ee28841abae3b7d8dec9/5681f5521c12101f97a4de89/5689fdb10ab377ae44ef1402/1451883959062/Final+Nosego.jpg",
					"biography": "Yis 'Nosego' Goodwin  is a Philadelphia-based artist with a passion for illustration and media arts.  He mixes fine art with a contemporary style to deliver highly energetic work. His designs feature an assemblage of patterns, vibrant colors and characters derived from his imagination and his surrounding environment.",
					"website": "https://www.nosego.com/",
					"address": "140 Jackson St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at Jackson St between N 3rd St and N 4th St.",
					"postalCode": "95112",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8566928,
						37.3526833
					]
				},
				"properties": {
					"title": "Mural at Mexican Heritage Plaza",
					"artist": "Unknown",
					"image": "  https://i0.wp.com/content-magazine.com/home/wp-content/uploads/2016/11/mhp_0013_web.jpg?resize=1050%2C700",
					"address": "1700 Alum Rock Ave",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at Alum Rock and King Rd",
					"postalCode": "95116",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8566928,
						37.3526833
					]
				},
				"properties": {
					"title": "Artistic Mestizaje",
					"artist": "Carlos Perez",
					"image": "https://vivafest.org/wp-content/uploads/2014/03/Artistic-Mestizaje.jpg",
					"description": "It is a visual representation both of Mexico’s rich cultural diversity and her visual arts heritage, depicting a history of indigenous, Hispanic and Latino visual.",
					"address": "1700 Alum Rock Ave",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at Alum Rock and King Rd",
					"postalCode": "95116",
					"state": "CA"
				}
			},
			 {
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8879794,
						37.3303372
					]
				},
				"properties": {
					"title": "Mural at The Studio Gym - Denis Korkh",
					"image": "https://ww2.kqed.org/arts/wp-content/uploads/sites/2/2016/06/Poesia_Borja_Korkh_CLakey.jpg",
					"artist": "Denis Korkh",
					"website": "https://deniskorkh.tumblr.com/",
					"description": "In the mural collage photo, the one on the left is the one by Poesia, the center one is by Michael Borja and the right one is by Denis Korkh",
					"address": "396 S 1st St.",
					"city": "San José",
					"country": "United States",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8879794,
						37.3303372
					]
				},
				"properties": {
					"title": "Mural at The Studio Gym - Poesia",
					"image": "https://ww2.kqed.org/arts/wp-content/uploads/sites/2/2016/06/Poesia_Borja_Korkh_CLakey.jpg",
					"artist": "Poesia",
					"website": "http://poesiatranscend.com/",
					"description": "In the mural collage photo, the one on the left is the one by Poesia, the center one is by Michael Borja and the right one is by Denis Korkh",
					"address": "396 S 1st St.",
					"city": "San José",
					"country": "United States",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8386949,
						37.3439391
					]
				},
				"properties": {
					"title": "Mural de la Raza",
					"image": "img/Muraldelaraza_by_FrankTorres_photoby_MaribelMartinezWillmes.jpg",
					"artist": "Frank Torres",
					"address": "2048 Story Road",
					"city": "San José",
					"country": "United States",
					"crossStreet": "on Story Rd btwn Hopkins Dr and Karl St.",
					"postalCode": "95122",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8930177,
						37.3475237
					]
				},
				"properties": {
					"title": "Old SJ",
					"image": "https://static1.squarespace.com/static/5681ee28841abae3b7d8dec9/5681f5521c12101f97a4de89/5684269ba128e6cd9b4cd03e/1451501214715/empirestreet.jpg",
					"artist": "Sam Rodriguez",
					"website": "http://samrodriguezart.com/",
					"biography": "Sam Rodriguez is an artist based out of San José, CA and have been fortunate to have had shown his work in public art spaces, museums, companies, galleries, internet, and editorial publications. For a number of years he was self-taught through the graffiti scene, until he later decided to expand his studies by pursuing a Bachelor in Fine Arts from California College of the Arts.  He has since blended what he absorbed from both experiences to create his current style.  At the moment, he is interested in two types of portraiture that he calls, 'Topographical Portraiture' and 'Type Faces'.  Topographical Portraits, are made by stylizing a portrait with topographical lines and shapes in a similar manner to those found through images on geographic maps. Type Faces, incorporate typography and portraiture. He developed these through countless studio sessions, to use as a platform for his interest in social, historic, and cultural hybridity.",
					"address": "270 E Empire St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at N 7th St and E Empire St.",
					"postalCode": "95112",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8832655,
						37.3351874
					]
				},
				"properties": {
					"title": "Olympic Black Power Statue - Tommie Smith & John Carlos",
					"image": "img/TommieSmithJohnCarlosStatues_photoby_YanYinChoy.jpg",
					"artist": "Rigo 23",
					"website": "https://www.facebook.com/pages/Rigo-23/138554102829939",
					"biography": "Rigo 23 is a Portuguese muralist, painter, and political artist residing in San Francisco, California. He is known in the San Francisco community for having painted a number of large, graphic 'sign' murals including: One Tree next to the U.S. Route 101 on-ramp at 10th and Bryant Street, Innercity Home on a large public housing structure, Sky/Ground on a tall abandoned building at 3rd and Mission Street, and Extinct over a Shell gas station.",
					"description": "On Oct. 16, 1968, Olympics in Mexico City, United States track athletes and San José State University students Tommie Smith and John Carlos were awarded medals for their athletic efforts. However, the great athletic feat would soon be shadowed by one of the most memorable moments in the American Civil Rights Movement. Tommie Smith and John Carlos would protest the poor treatment of African-American people in the United States and stood to empower the African American community. This is a great symbol for the community of San José State University. Tommie Smith and John Carlos were both students at this prestigious university and showed San José State University students of the present and the future that students can make a difference on the global stage.",
					"address": "1 Washingtown Square",
					"city": "San José",
					"country": "United States",
					"postalCode": "95192",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8877396,
						37.3289492
					]
				},
				"properties": {
					"title": "Peeps and Pups",
					"description": "Mural at Mayfair Community Center Skate Park",
					"artist": "Force129",
					"biography": "Fernando 'FORCE129' Amaro Jr born & raised in San José, California. Currently working full time as a Artist & Designer and a stay at home dad. Working in mixed media allows me to work on a variety of projects and styles at any given time. Spray can Art is my first love but I also can work some magic on the computer utilizing Adobe Photoshop to take my art and your projects to the next level. If you are interested in collaborating or networking or having me bring your project to life let's connect send me a detailed message and we can go from there looking forward to hearing from you. Peace / Thanks for your interest in my Art & Design work.",
					"website": "http://www.force129.com/",
					"address": "467 S 1st Street",
					"city": "San José",
					"country": "United States",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.892009,
						37.335663
					]
				},
				"properties": {
					"title": "Phylum of the Free",
					"image": "http://ww2.kqed.org/arts/wp-content/uploads/sites/2/2016/06/JeffHemming_BEder.jpg",
					"artist": "Jeffrey Andrade Hemming",
					"website": "http://www.andradehemming.com/",
					"biography": "Jeff Andrade Hemming is a Bay Area artist who paints in oil and creates  complex works of art. The style of work he makes falls in a maximalist genre. Jeff’s work shows a hyper-exuberant and complex overlaying of converging elements in an entropic manner. The elements are images of materials that connotes society’s excess materialism, and in addition, Jeff amalgamates the concept of the ever changing macro/micro-relations between humanity and his environment.",
					"address": "30 S 1st St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at Fountain Alley and S 1st St.",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8945308,
						37.3493987
					]
				},
				"properties": {
					"title": "Ryu",
					"artist": "Horimoto and State of Grace",
					"address": "221 Jackson St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at Jackson St btwn N 5th St and N 6th St.",
					"postalCode": "95112",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8973815,
						37.3516584
					]
				},
				"properties": {
					"title": "Santo Market",
					"image": "https://static1.squarespace.com/static/5681ee28841abae3b7d8dec9/5681f5521c12101f97a4de89/568425c2cbced6a0157418b1/1455301651617/john-barrick_0.jpg",
					"artist": "John Barrick",
					"biography": "John Barrick is a multidisciplinary artist from San José, California. His work includes large-scale murals, custom sign painting and fine art commissions.",
					"website": "https://www.johnbsigns.com/",
					"address": "245 E Taylor St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at N 6th St and Taylor St.",
					"postalCode": "95112",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8879794,
						37.3303372
					]
				},
				"properties": {
					"title": "SoFA",
					"image": "https://i0.wp.com/content-magazine.com/home/wp-content/uploads/2017/05/Murals_0010rt.jpg?resize=768%2C511",
					"artist": "Sam Rodriguez",
					"description": "This mural about the South First Artwalk District is located behind The Studio gym.",
					"address": "The Studio, 396 S 1st St",
					"city": "San José",
					"country": "United States",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8879794,
						37.3303372
					]
				},
				"properties": {
					"title": "Symphony of Style; Color, Light, and Sound",
					"description": "Street print design - located between S 1st Street and San Salvador Street in SOFA District, San José, California",
					"image": "https://ww2.kqed.org/arts/wp-content/uploads/sites/2/2016/06/ScapeMartinez_CLakey.jpg",
					"artist": "Scape Martinez",
					"website": "http://www.scapemartinez.com/",
					"address": "396 S 1st St.",
					"city": "San José",
					"country": "United States",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8883792,
						37.3305361
					]
				},
				"properties": {
					"title": "Tribute to Rahsaan Roland Kirk",
					"image": "https://i2.wp.com/content-magazine.com/home/wp-content/uploads/2017/05/Murals_0006rt.jpg?resize=768%2C511",
					"artist": "Roger Ourthiague and Chris Anway ",
					"description": "This mural is tribute to Rahsaan Roland Kirk, the late jazz legend who often played multiple instruments at once. It is located behind Cafe Stritch.",
					"address": "374 S 1st St",
					"city": "San José",
					"country": "United States",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8864959,
						37.3283802
					]
				},
				"properties": {
					"title": "Untitled",
					"image": "http://ww2.kqed.org/arts/wp-content/uploads/sites/2/2016/06/MACLA_Aaron_De_La_Cruz_DSC_5932.jpg",
					"artist": "Aaron De La Cruz",
					"address": "510 S 1st St.",
					"city": "San José",
					"country": "United States",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
							-121.8915307,
							37.3360475
					]
				},
				"properties": {
					"title": "Untitled",
					"image": "img/LocalColorHeartMural_by_FranciscoRamirez_photoby_YanYinChoy.jpg",
					"artist": "Francisco Ramirez",
					"biography": "I’m a self-taught artist from Mexico but mostly raised in San José California. I’ve worked with mostly acrylic and watercolor but I’ve also worked with pastel, oil, photography, murals , body painting and other mixed media.",
					"website": "https://www.instagram.com/fco1980/",
					"address": "15 Fountain Alley",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at Fountain Alley and S 2nd Street",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8440888,
						37.3509588
					]
				},
				"properties": {
					"title": "Untitled murals at the Mayfair Community Center",
					"image": "img/MayfairCommunityCenterMural_photoby_TomasWisperTalamentes.jpg",
					"description": "Mayfair Community Center and Skate Park murals by various local artists, including Tomas Wisper Talamentes",
					"artist": "Various Artists",
					"address": "2031 Kammerer Ave",
					"city": "San José",
					"country": "United States",
					"postalCode": "95116",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8786211,
						37.3449119
					]
				},
				"properties": {
					"title": "Untitled mural by Op",
					"image": "https://static1.squarespace.com/static/5681ee28841abae3b7d8dec9/5681f5521c12101f97a4de89/59728a5d1b631b490c816ae3/1500678750196img_9003.jpg",
					"artist": "Op",
					"website": "https://www.instagram.com/ohhpeeskee/",
					"address": "748 E St John St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at N 6th and St. John St.",
					"postalCode": "95112",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8619931,
						37.3457813
					]
				},
				"properties": {
					"title": "Virgin de Guadalupe",
					"artist": "Unknown",
					"address": "195 S 28th St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at S 28th and E San Antonio St.",
					"postalCode": "95116",
					"state": "CA"
				},
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
							-121.8944242,
							37.350025
					]
				},
				"properties": {
					"title": "Wavy",
					"artist": "Jesico",
					"address": "600 N 7th St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at N 7th St and Jackston St.",
					"postalCode": "95112",
					"state": "CA"
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						-121.8879167,
						37.3283147
					]
				},
				"properties": {
					"title": "What You Are I Once Was",
					"image": "https://i2.wp.com/content-magazine.com/home/wp-content/uploads/2017/05/Murals_0037rt.jpg?resize=768%2C511",
					"artist": "Stephanie Azevedo",
					"description": "Commentary on the drought in California. The hair represents water and the skull represents scarcity.",
					"address": "489 S Market St.",
					"city": "San José",
					"country": "United States",
					"crossStreet": "at S Market Stand W William St.",
					"postalCode": "95113",
					"state": "CA"
				}
			},
			{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [
							-121.8808869,
							37.3226982
						]
					},
					"properties": {
						"title": "You are never strong enough where you don’t need help' - César Chávez",
						"image": "img/CesarChavezQuoteMural_TomasTalamantes_photoby_yanyinchoy.jpg",
						"artist": "Tomas Talamantes",
						"description": "Nunca eres lo suficientemente fuerte para no necesitar ayuda - César Chávez",
						"website": "https://www.facebook.com/wisper.t.talamantes",
						"address": "899 S 1st St.",
						"city": "San José",
						"country": "United States",
						"postalCode": "95113",
						"state": "CA"
					}
				}
	 ]
 };


// adds data to map
map.on('load', function(e) {
	map.addSource('places', {
			type: 'geojson',
			data: art
	});
	buildLocationList(art); //initilize list.  call function when map loads
});

//Interaction with DOM markers
art.features.forEach(function(marker, i) {
	// Create an img class='responsive' element for the marker
	var el = document.createElement('div');
	el.id = "marker-" + i;
	el.className = 'marker';
	//el.style.left='-50px';
	//el.style.top='-50px';
	// Add markers to the map at all points
	new mapboxgl.Marker(el)
			.setLngLat(marker.geometry.coordinates)
			.addTo(map);

/* Interactions with DOM markers
art.features.forEach(function(marker) {
	// Create a div element for the marker
	var el = document.createElement('div');
	// Add a class called 'marker' to each div
	el.className = 'marker';
	// By default the image for your custom marker will be anchored
	// by its center. Adjust the position accordingly
	new mapboxgl.Marker(el, { offset: [-50 / 2, -50 / 2] })
		.setLngLat(marker.geometry.coordinates)
		.addTo(map);
*/
	el.addEventListener('click', function(e) {
		var activeItem = document.getElementsByClassName('active');
		// 1. Fly to the point
		flyToArt(marker);
		// 2. Close all other popups and display popup for clicked art
		createPopUp(marker);
		// 3. Highlight listing in sidebar (and remove highlight for all other listings)
		e.stopPropagation();
		if (activeItem[0]) {
			activeItem[0].classList.remove('active');
		}
		var listing = document.getElementById('listing-' + i);
		console.log(listing);
		listing.classList.add('active');
	});
});

function flyToArt(currentFeature) {
	map.flyTo({
			center: currentFeature.geometry.coordinates,
			zoom: 15
		});
}

 function createPopUp(currentFeature) {
	var popUps = document.getElementsByClassName('mapboxgl-popup');
	if (popUps[0]) popUps[0].remove();


	var popup = new mapboxgl.Popup({closeOnClick: true, closeButton: true, anchor: 'top'})
				.setLngLat(currentFeature.geometry.coordinates)
				.setHTML('<h3>' + currentFeature.properties.title + '</h3>' +
					'<h4>' + `by ` + currentFeature.properties.artist + '<br/>' + `Address: ` +  currentFeature.properties.address + ', ' + currentFeature.properties.city + ', ' +  currentFeature.properties.state + ' ' + currentFeature.properties.postalCode + '</h4'
				 )
				.addTo(map);
}

function buildLocationList(data) {
	// Iterate through the list of arts
	for (i = 0; i < data.features.length; i++) {
		var currentFeature = data.features[i];
		// Shorten data.feature.properties to just `prop` so we're not
		// writing this long form over and over again.
		var prop = currentFeature.properties;
		// Select the listing container in the HTML and append a div
		// with the class 'item' for each art
		var listings = document.getElementById('listings');
		var listing = listings.appendChild(document.createElement('div'));
		listing.className = 'item';
		listing.id = 'listing-' + i;

		// Create a new link with the class 'title' for each art
		// and fill it with the art address
		var link = listing.appendChild(document.createElement('a'));
		link.href = '#';
		link.className = 'title';
		link.dataPosition = i;
		link.innerHTML = prop.title;

		// Create a new div with the class 'details' for each listing
		// and fill it with the following
		var artist = listing.appendChild(document.createElement('div'));
		artist.innerHTML = 'by ' + prop.artist;

		var address = listing.appendChild(document.createElement('div'));
		address.innerHTML = prop.address + ', ' + prop.city + ', ' + prop.state + " " + prop.postalCode ;

		var artImage = listing.appendChild(document.createElement('div'));
		artImage.innerHTML = '<br/>' + "<img src=\"" + prop.image + "\">";

		var story = listing.appendChild(document.createElement('div'));
		if (prop.description) {
			story.innerHTML = '<br/>' + prop.description;
		}


	 link.addEventListener('click', function(e){
			// Update the currentFeature to the store associated with the clicked link
			var clickedListing = data.features[this.dataPosition];

			// 1. Fly to the point
			flyToArt(clickedListing);

			// 2. Close all other popups and display popup for clicked point
			createPopUp(clickedListing);

			// 3. Highlight listing in sidebar (and remove highlight for all other listings)
			var activeItem = document.getElementsByClassName('active');

			//TODO: fix issue - classList is not defined
			if (activeItem[0]) {
				 activeItem[0].classList.remove('active');
			}
			this.parentNode.classList.add('active');

		});
	}
}

