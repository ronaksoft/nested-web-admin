export default class {
  // this will parse a delimited string into an array of
  // arrays. the default delimiter is the comma, but this
  // can be overriden in the second argument.
  static parse(strData: string, strDelimiter: string) {
    // check to see if the delimiter is defined. if not,
    // then default to comma.
    strDelimiter = (strDelimiter || ',');
    // create a regular expression to parse the csv values.
    const objPattern = new RegExp(
        (
            // delimiters.
            '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +
            // quoted fields.
            '(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|' +
            // standard fields.
            '([^\"\\' + strDelimiter + '\\r\\n]*))'
        ),
        'gi'
        );
    // create an array to hold our data. give the array
    // a default empty first row.
    const arrData = [[]];
    // create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;
    // keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )) {
        // get the delimiter that was found.
        let strMatchedDelimiter = arrMatches[ 1 ];
        // check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. if id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter !== strDelimiter)
            ) {
            // since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );
        }
        // now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]) {
            // we found a quoted value. when we capture
            // this value, unescape any double quotes.
            let strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( '\"\"', 'g' ),
                '\"'
                );
        } else {
            // we found a non-quoted value.
            let strMatchedValue = arrMatches[ 3 ];
        }
        // now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    // return the parsed data.
    return( arrData );
  }
}
