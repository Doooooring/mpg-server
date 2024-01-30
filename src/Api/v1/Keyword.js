/**
 * @api {get} /keyword/keywords Request Keywords List
 * 
 * @apiVersion        1.0.0
 * @apiName GetKeywordList
 * @apiGroup Keyword
 *
 * @apiQuery {string} search Keyword Filter
 * @apiQuery {number} offset keyword list offset
 * @apiQuery {number} limit keyword list limit
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
            success : boolean, 
            result : {
                keywords : Array<{
                    _id : string;
                    keyword : string;
                }>
            }
        }
 */
