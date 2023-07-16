$(document).ready(function(){
    let names = [];
    let rulesApplied = [];
    $("#searchName").click(function(e){
        e.preventDefault();
        $(this).find("i").show();
        const nameLength = $("#nameLength").val();
        const numberOfVowels = $("#numberOfVowels").val();
        const numberOfRepeatingCharacter = $("#numberOfRepeatingCharacter").val();
        const numberOfAdjacentCharacters = $("#numberOfAdjacentCharacters").val();
        if(nameLength && nameLength != ""){
            rulesApplied.push(`Name leght : ${nameLength}`);
        }
        if(numberOfVowels && numberOfVowels != ""){
            rulesApplied.push(`Number of vowels : ${numberOfVowels}`);
        }
        if(numberOfRepeatingCharacter && numberOfRepeatingCharacter != ""){
            rulesApplied.push(`Number of repeating character : ${numberOfRepeatingCharacter}`);
        }
        if(numberOfAdjacentCharacters && numberOfAdjacentCharacters != ""){
            rulesApplied.push(`Number of adjacent characters ${numberOfAdjacentCharacters}`);
        }
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
                const nameCount = names.length;
                $("#namesCountSpan").text(nameCount);
                $("#infoDiv").show();
                $("#searchName").find("i").hide();
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
                rulesApplied.push(`Name includes letter : ${letter}`);
                break;
            case "notIncludes" :
                names = nameNotIncludes(names,letter);
                rulesApplied.push(`Name not includes letter : ${letter}`);
                break;
            case "letterAtPosition" :
                names = letterAtPosition(names,letter,letterPosition);
                rulesApplied.push(`Letter at position ${letterPosition} is ${letter}`);
                break;
            case "letterInAlphaSet" :
                names = letterInAlphaSet(names,letterPosition,letterSet);
                rulesApplied.push(`Letter at position ${letterPosition} comes in set ${letterSet}`);
                break;
            case "lettersAreSameAtPosition" :
                names = lettersAreSameAtPosition(names,letterPosition,secondLetterPosition);
                rulesApplied.push(`Letters at position ${letterPosition} and ${secondLetterPosition} is same`);
                break;
            case "lettersAtPositionIsVowel" : 
                names = lettersAtPositionIsVowel(names,letterPosition);
                rulesApplied.push(`Leter at position ${letterPosition} is vowel`);
                break;
        }
        $("#namesCountSpan").text(names.length);
        recreateNameTable(names);
        recreateRuleTable(rulesApplied);
    })

    $("#showNamesButton").click(function(){
        if($('#nameTableDiv').is(":visible"))
            $('#nameTableDiv').hide();
        else{
            createNameTable(names);
        }
        
    })

    $("#showRuleButton").click(function(){
        if($('#ruleTableDiv').is(":visible")){
            $('#ruleTableDiv').hide();
        }else{
            createRuleTable(rulesApplied);
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

function recreateNameTable(names){
    if($('#nameTableDiv').is(":visible")){
        createNameTable(names);
    }
}

function recreateRuleTable(rules){
    if($('#ruleTableDiv').is(":visible")){
        createRuleTable(rules);
    }
}

function createNameTable(names){
    $("#nameTable tbody").empty();
    $.each(names,function(key,name){
        let tableRow = `<tr>
                            <td>${key + 1}</td>
                            <td>${name}</td>
                        </tr>`
        $("#nameTable tbody").append(tableRow);
    })
    $("#nameTableDiv").show();
}

function createRuleTable(rules){
    $("#ruleTableDiv").show();
    $("#ruleTable tbody").empty();
    $.each(rules,function(key,rule){
        let tableRow = `<tr>
                            <td>${key + 1}</td>
                            <td>${rule}</td>
                        </tr>`
        $("#ruleTable tbody").append(tableRow);
    })
}