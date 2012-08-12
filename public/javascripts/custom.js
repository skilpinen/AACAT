/**
 * 
 */

function validForm(form){
	return form.elements.search.value != ""
}

function submitSearch() {
  var userForm = document.forms.crewsearch;
  if (validForm(userForm))
    userForm.submit();
  else
    alert("Give us a name and a valid e-mail address!");
};
