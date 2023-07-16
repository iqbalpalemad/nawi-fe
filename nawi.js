$(document).ready(function(){
    $("#searchName").click(function(e){
        e.preventDefault();
        const nameLength = $("#nameLength").val();
        const numberOfVowels = $("#numberOfVowels").val();
        const numberOfRepeatingCharacter = $("#numberOfRepeatingCharacter").val();
        const numberOfAdjacentCharacters = $("#numberOfAdjacentCharacters").val();
        const data = {
            length : ( nameLength && nameLength != "" ) ? parseInt(nameLength) : null,
            numberOfVowels : (numberOfVowels && numberOfVowels != "" ) ? parseInt(numberOfVowels) : null,
            numberOfRepeatingCharacter : (numberOfRepeatingCharacter && numberOfRepeatingCharacter != "") ? parseInt(numberOfRepeatingCharacter) : null,
            numberOfAdjacentCharacters : (numberOfAdjacentCharacters && numberOfAdjacentCharacters != "") ? parseInt(numberOfAdjacentCharacters) : null
        }
        sendAjax('search',"post",data,function(data){
            if(data.result){
                $("#mainSearchForm").hide();
            }
            else{
                alert("Failed to get names. Please try again");
            }
        });
    })
})