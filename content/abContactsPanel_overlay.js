

function send2mail2(send_type) {

  let cards = GetSelectedAbCards(); // alle selektierten Kontakte oder Listen
  let count = cards.length; // Anzahl der selektierten Kontakte oder Listen

  for (var i = 0; i < count; i++) // Schleife durch alle selektierten Kontakte oder Listen
  {
      //Thunderbird nennt die Kontakte und Listen "Cards"
    if (cards[i].isMailList) {
      //wenn es sich bei der aktuellen "Card" um eine VerteilerListe handelt

      // Verteielrlisten werden genauso behandelt wie Adressbücher - es sind "Directories", die über
      // einen URI angesprochen werden und mehrere "Cards" enthalten
      let directory = GetDirectoryFromURI(cards[i].mailListURI);
      let childCards = directory.childCards;
      //Schleife durch alle "Kinder-Cards" der Verteilerliste
      // die komische Vorgehensweise mit hasMoreElemenst und getNext ist den vielfältigen "Sammlungen" von thunderbird geschuldet - aheb ich lange nach gesucht ...

      while (childCards.hasMoreElements()) {
        let card = childCards.getNext(); // hier wird die einzelne Karte der Sammlung an "card" übergeben
        if (card instanceof Components.interfaces.nsIAbCard){ // das muss noch mal nachgefragt werden, sonst geht es nicht ...

           //turn each card into a properly formatted address
            let address = GenerateAddressFromCard(card);
            //wenn die Adresse nicht leer ist ...
            if (address != "") parent.AddRecipient(send_type, address);

      	   try { // nun überprüfen, ob diese "Card", die ja einen Kontakt darstellt, auch eine zweite Mailadresse besitzt
      	      if(card.getPropertyAsAString('SecondEmail')) throw "true";
      		   else throw "false";
      	   }
      	   catch(e){
      	 	   if(e == "true"){
      	 		   let mail2 = card.getPropertyAsAString('SecondEmail');
                  parent.AddRecipient(send_type , mail2);
      	 	   }
            }
        }
      }
    }else{ // wenn es sich bei dieser "Card" nicht um eine Verteilerliste, sondern um einen einzelnen Kontakt handelt...
      //turn each card into a properly formatted address
      let address = GenerateAddressFromCard(cards[i]);
       if (address != "") parent.AddRecipient(send_type, address);
   	 try {
   	 	if(cards[i].getPropertyAsAString('SecondEmail')) throw "true";
   		else throw "false";
   	 }
   	 catch(e){
   	 	if(e == "true"){
   	 		let mail2 = cards[i].getPropertyAsAString('SecondEmail');
            parent.AddRecipient(send_type , mail2);
   	   }
      }
   }
}

}
