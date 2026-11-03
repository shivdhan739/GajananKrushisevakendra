/* protect.js: copy protection REMOVED.
   Ata user ani admin donhi kuthlahi ek shabd / text select ani copy karu shaktat.
   Ha file site var ठेवla tari kahi block karat nahi (je adhi lagla hota te sagla kaadhla).
   Pan ha file delete karun index.html madhla <script src="protect.js"> line pan kaadhlis tari chalte. */
(function(){
  /* junya version ne laavlele block jar cache madhe rahile asel tar te kaadhto */
  var de=document.documentElement;
  de.classList.remove("nocopy","shot");
  var s=document.getElementById("protect-css");if(s)s.remove();
  var g=document.getElementById("guard");if(g)g.remove();
})();
