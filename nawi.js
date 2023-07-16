$(document).ready(function(){
    let names = [];
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
                names = data.names ? data.names : [];
                $("#mainSearchForm").hide();
                $("#ruleForm").show();
            }
            else{
                alert("Failed to get names. Please try again");
            }
        });
    })

    $("#rule").change(function(){
        $("#ruleLetterDiv").hide();
        $("#letterPositionDiv").hide();
        $("#secondPositionDiv").hide();
        $("#letterSetDiv").hide();
        $("#ruleLetter").val("");
        $("#letterPosition").val("");
        $("#secondPosition").val("");
        $("#letterSet").val(0);

        const rule = $(this).val();
        switch(rule){
            case "includes" :
                $("#ruleLetterDiv").show();
                break;
            case "notIncludes" :
                $("#ruleLetterDiv").show();
                break;
            case "letterAtPosition" :
                $("#ruleLetterDiv").show();
                $("#letterPositionDiv").show();
                break;
            case "letterInAlphaSet" :
                $("#letterPositionDiv").show();
                $("#letterSetDiv").show();
                break;
            case "lettersAreSameAtPosition" :
                $("#letterPositionDiv").show();
                $("#secondPositionDiv").show();
                break;
            case "lettersAtPositionIsVowel" : 
                $("#letterPositionDiv").show();
                break;
        }
    })

    $("#filterNames").click(function(e){
        e.preventDefault();
        const rule = $("#rule").val();
        const letter = $("#ruleLetter").val();
        const letterPosition = parseInt($("#letterPosition").val());
        const secondLetterPosition = parseInt($("#secondPosition").val());
        const letterSet = parseInt($("#letterSet").val());
        switch(rule){
            case "includes" :
                names = nameIncludes(names,letter);
                break;
            case "notIncludes" :
                names = nameNotIncludes(names,letter);
                break;
            case "letterAtPosition" :
                names = letterAtPosition(names,letter,letterPosition);
                break;
            case "letterInAlphaSet" :
                names = letterInAlphaSet(names,letterPosition,letterSet);
                break;
            case "lettersAreSameAtPosition" :
                names = lettersAreSameAtPosition(names,letterPosition,secondLetterPosition);
                break;
            case "lettersAtPositionIsVowel" : 
                names = lettersAtPositionIsVowel(names,letterPosition);
                break;
        }
    })
})


function nameIncludes(names,letter){
    const lowercaseLetter = letter.toLowerCase();
    return names.filter((name) => name.toLowerCase().includes(lowercaseLetter));
}

function nameNotIncludes(names,letter){
    const lowercaseLetter = letter.toLowerCase();
    return names.filter((name) => !name.toLowerCase().includes(lowercaseLetter));
}

function letterAtPosition(names, letter, position) {
    return names.filter((str) => str.charAt(position - 1).toLowerCase() === letter.toLowerCase());
}

function letterInAlphaSet(names, position, alphaSet) {
    let startChar, endChar;
    if (alphaSet === 1) {
      startChar = 'a';
      endChar = 'j';
    } else if (alphaSet === 2) {
      startChar = 'k';
      endChar = 't';
    } else if (alphaSet === 3) {
      startChar = 'u';
      endChar = 'z';
    } else {
      return []; 
    }
  
    return names.filter((str) => {
      const char = str.charAt(position - 1).toLowerCase();
      return char >= startChar && char <= endChar;
    });
}

function lettersAreSameAtPosition(names, position1, position2) {
    return names.filter((str) => {
      const char1 = str.charAt(position1 - 1).toLowerCase();
      const char2 = str.charAt(position2 - 1).toLowerCase();
      return char1 === char2;
    });
}

function lettersAtPositionIsVowel(names, position) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];

  return names.filter((str) => {
    const char = str.charAt(position - 1).toLowerCase();
    return vowels.includes(char);
  });
}