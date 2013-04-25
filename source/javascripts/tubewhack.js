//All the tube stations
var stations = ["Acton Town","Aldgate","Aldgate East","All Saints","Alperton","Amersham","Angel","Archway","Arnos Grove","Arsenal","Baker Street","Balham","Bank","Barbican","Barking","Barkingside","Barons Court","Bayswater","Beckton","Beckton Park","Becontree","Belsize Park","Bermondsey","Bethnal Green","Blackfriars","Blackhorse Road","Blackwall","Bond Street","Borough","Boston Manor","Bounds Green","Bow Church","Bow Road","Brent Cross","Brixton","Bromley-by-Bow","Buckhurst Hill","Burnt Oak","Caledonian Road","Camden Town","Canada Water","Canary Wharf","Canary Wharf","Canning Town","Cannon Street","Canons Park","Chalfont and Latimer","Chalk Farm","Chancery Lane","Charing Cross","Chesham","Chigwell","Chiswick Park","Chorleywood","Clapham Common","Clapham North","Clapham South","Cockfosters","Colindale","Colliers Wood","Covent Garden","Crossharbour","Croxley","Custom House","Cutty Sark","Cyprus","Dagenham East","Dagenham Heathway","Debden","Deptford Bridge","Devons Road","Dollis Hill","Ealing Broadway","Ealing Common","Earl's Court","East Acton","East Finchley","East Ham","East India","East Putney","Eastcote","Edgware","Edgware Road","Edgware Road","Elephant and Castle","Elm Park","Elverson Road","Embankment","Epping","Euston","Euston Square","Fairlop","Farringdon","Finchley Central","Finchley Road","Finsbury Park","Fulham Broadway","Gallions Reach","Gants Hill","Gloucester Road","Golders Green","Goldhawk Road","Goodge Street","Grange Hill","Great Portland Street","Greenford","Green Park","Greenwich","Gunnersbury","Hainault","Hammersmith","Hammersmith","Hampstead","Hanger Lane","Harlesden","Harrow and Wealdstone","Harrow-on-the-Hill","Hatton Cross","Heathrow Terminals 1, 2, 3","Heathrow Terminal 4","Heathrow Terminal 5","Hendon Central","Heron Quays","High Barnet","Highbury and Islington","Highgate","High Street Kensington","Hillingdon","Holborn","Holland Park","Holloway Road","Hornchurch","Hounslow Central","Hounslow East","Hounslow West","Hyde Park Corner","Ickenham","Island Gardens","Kennington","Kensal Green","Kensington (Olympia)","Kentish Town","Kenton","Kew Gardens","Kilburn","Kilburn Park","King George V","Kingsbury","King's Cross St. Pancras","Knightsbridge","Ladbroke Grove","Lambeth North","Lancaster Gate","Langdon Park","Latimer Road","Leicester Square","Lewisham","Leyton","Leytonstone","Limehouse","Liverpool Street","London Bridge","London City Airport","Loughton","Maida Vale","Manor House","Mansion House","Marble Arch","Marylebone","Mile End","Mill Hill East","Monument","Moorgate","Moor Park","Morden","Mornington Crescent","Mudchute","Neasden","Newbury Park","North Acton","North Ealing","North Greenwich","North Harrow","North Wembley","Northfields","Northolt","Northwick Park","Northwood","Northwood Hills","Notting Hill Gate","Oakwood","Old Street","Osterley","Oval","Oxford Circus","Paddington","Park Royal","Parsons Green","Perivale","Piccadilly Circus","Pimlico","Pinner","Plaistow","Pontoon Dock","Poplar","Preston Road","Prince Regent","Pudding Mill Lane","Putney Bridge","Queen's Park","Queensbury","Queensway","Ravenscourt Park","Rayners Lane","Redbridge","Regent's Park","Richmond","Rickmansworth","Roding Valley","Royal Albert","Royal Oak","Royal Victoria","Ruislip","Ruislip Gardens","Ruislip Manor","Russell Square","St. James's Park","St. John's Wood","St. Paul's","Seven Sisters","Shadwell","Shepherd's Bush","Shepherd's Bush Market","Sloane Square","Snaresbrook","South Ealing","South Harrow","South Kensington","South Kenton","South Quay","South Ruislip","South Wimbledon","South Woodford","Southfields","Southgate","Southwark","Stamford Brook","Stanmore","Stepney Green","Stockwell","Stonebridge Park","Stratford","Sudbury Hill","Sudbury Town","Swiss Cottage","Temple","Theydon Bois","Tooting Bec","Tooting Broadway","Tottenham Court Road","Tottenham Hale","Totteridge and Whetstone","Tower Gateway","Tower Hill","Tufnell Park","Turnham Green","Turnpike Lane","Upminster","Upminster Bridge","Upney","Upton Park","Uxbridge","Vauxhall","Victoria","Walthamstow Central","Wanstead","Warren Street","Warwick Avenue","Waterloo","Watford","Wembley Central","Wembley Park","West Acton","West Brompton","West Finchley","West Ham","West Hampstead","West Harrow","West India Quay","West Kensington","West Ruislip","West Silvertown","Westbourne Park","Westferry","Westminster","White City","Whitechapel","Willesden Green","Willesden Junction","Wimbledon","Wimbledon Park","Wood Green","Wood Lane","Woodford","Woodside Park","Woolwich Arsenal"];
var form = document.getElementById('checkphrase');

function submithandler(e) {
	var i, dummyobj = {}, regexstring = '', matchedstations = [], msg = '';
	
	//Strip out non-alpha chars
	var normalisedphrase = document.getElementById('phrase').value.toLowerCase().replace(/[^a-z]/g, '');
	
	//Get the unique characters in this phrase, build a regex out of them
	for (i=0; i < normalisedphrase.length; i++) { dummyobj[normalisedphrase.charAt(i)] = true; }
	for (var letter in dummyobj) { if (dummyobj.hasOwnProperty(letter)) { regexstring += '|' + letter; } }
	
	//Regex to check unique chars. substring to get rid of the leading |
	var uniqueletters = new RegExp(regexstring.substring(1), "i");
	
	//For every station check if none of the letters match it to the list
	for (i in stations) {
		if (!uniqueletters.test(stations[i])) {
			matchedstations.push(stations[i]);
		}
	}
	
	//Display a list of matched stations
	if (matchedstations.length === 0) {
		//No matches at all - Nothing to write home about - you've probably used all the vowels
		msg = "Doh! Every station uses at least one of the letters in that phrase, try using less vowels";
	}
	else if (matchedstations.length == 1) {
		//Hurrah a unique match
		msg = "Nice one! Only one station does not contain any of the letters in your phrase. It's: ";
	}
	else if (matchedstations.length <= 5) {
		//Less than 5 - Ooh so close
		msg = "Not a bad effort! " + matchedstations.length + " stations do not contain any of the letters in your phrase. They are: ";
	}
	else if (matchedstations.length <= 10) {
		//Less than 10 - Not quite there
		msg = "Not quite there. " + matchedstations.length + " stations do not contain any of the letters in your phrase. They are: ";
	}
	else {
		//More than 10 matches - Not quite specific enough.
		msg = "Oh Dear! You'll need to make your phrase a bit longer as " + matchedstations.length + " stations do not contain any of the letters in your phrase. They are: ";
	}
	
	document.getElementById('results').innerHTML = '<h2>Results</h2> <p>' + msg + (matchedstations.length ? ' <em>' + matchedstations.join(', ') + '</em>' : '') + '.</p>';
	
	//Stop the form submiting - Yay for IE doing things slightly differently again
	if ( e.preventDefault ) { e.preventDefault(); }
	e.returnValue = false;
	return false;
}

//Bind it - Yay IE Events
if (form.addEventListener) { form.addEventListener('submit', submithandler, false); }
else if (form.attachEvent) { form.attachEvent('onsubmit', submithandler); }
