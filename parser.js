function weeksArrayFormer(weeks, decider) {
    let weekArray = [];
    for(let i = Number(weeks.split("-")[0]); i <= Number(weeks.split("-")[1]); i++){
        if(decider.indexOf("单周") !== -1){
            if (i % 2 === 0) {
                continue;
            }
            weekArray.push(i);
        }
        else if (decider.indexOf("双周") !== -1){
            if(i % 2 === 0){
                weekArray.push(i);
            }
        }else {
            weekArray.push(i);
        }
    }
    return weekArray;
}

function jsonObjectFormer(rawContent,indexX,indexY){
    let jsonObject = {};
    let sections = [
        [
            {
                "section":1,
                "startTime":"8:00",
                "endTime":"8:45"
            },
            {
                "section":2,
                "startTime":"8:55",
                "endTime":"9:40"
            }
        ],
        [
            {
                "section":3,
                "startTime":"10:10",
                "endTime":"10:55"
            },
            {
                "section":4,
                "startTime":"11:05",
                "endTime":"11:55"
            }
        ],
        [
            {
                "section":5,
                "startTime":"13:45",
                "endTime":"14:30"
            },
            {
                "section":6,
                "startTime":"14:40",
                "endTime":"15:25"
            }
        ],
        [
            {
                "section":7,
                "startTime":"15:55",
                "endTime":"16:40"
            },
            {
                "section":8,
                "startTime":"16:50",
                "endTime":"17:35"
            }
        ],
        [
            {
                "section":9,
                "startTime":"18:45",
                "endTime":"19:30"
            },
            {
                "section":10,
                "startTime":"19:40",
                "endTime":"20:25"
            }
        ]
    ];
    jsonObject['name'] = rawContent[0];
    jsonObject['teacher'] = rawContent[1].split(/[()]/)[0];
    jsonObject['day'] = indexY;
    jsonObject['sections'] = sections[indexX-1];
    if (!(rawContent[1].search(/体育部/))){
        jsonObject['position'] = '体育上课地点';
        jsonObject['weeks'] = weeksArrayFormer('1-18','{}');
        return jsonObject;
    }
    if (!(rawContent[1].search(/大外部/))){
        jsonObject['position'] = '外语上课地点';
        jsonObject['weeks'] = weeksArrayFormer('1-18','{}');
        return jsonObject;
    }
    jsonObject['weeks'] = weeksArrayFormer(rawContent[1].split(/[()]/)[1],rawContent[4]);
    jsonObject['position'] = rawContent[2];
    return jsonObject;
    //function modified from Dustella.Thank you!
}

function scheduleHtmlParser(html) {
    let courseInfos = [];
    const $ = cheerio.load(html, { decodeEntities: false });
    $('#TABLE1').find('tr').each(function (indexX){
        //每行
        if(indexX !== 0 && indexX !==7 ){
            $(this).find("td").each(function (indexY){
                //每列
                if(indexY !== 0 ){
                    $(this).text().split("◆").forEach(function (value){
                        if(value !== ' '){
                            //若本时课非空
                            let rawContent = value.split("◇");
                            let jsonObject = jsonObjectFormer(rawContent,indexX,indexY);
                            courseInfos.push(jsonObject);
                        }
                    })
                }
            })
        }
        }
    )
    let returnJsons = {};
    returnJsons['courseInfos'] = courseInfos;
    return returnJsons;
}
//callback hell ...isn't it?