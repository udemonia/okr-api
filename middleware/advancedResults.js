const advancedResults = (model, populate) => async (req, res, next) => {
    let query;
  
    // Copy req.query
    const reqQuery = { ...req.query };
  
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
  
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
  
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
  
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
    // Finding resource
    query = model.find(JSON.parse(queryStr));
  
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
  
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
  
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
  
    query = query.skip(startIndex).limit(limit);
  
    if (populate) {
      query = query.populate(populate);
    }
  
    // Executing query
    const results = await query;
  
    // Pagination result
    const pagination = {};
  
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
  
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
  
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
    };
  
    next();
  };
  
  module.exports = advancedResults;



// const advancedResults = (model, populate) => async(req,res,next) => {
//     const requestQuery = { ...req.query }

//     //* create an array of elements to remove - key words, like reserved words
//     const removedElements = ['select', 'sort', 'page', 'limit']

//     // loop over request query remove it
//     removedElements.forEach(param => delete requestQuery[param] )

//     //? - - - -> request query
//     let query;
//     // request query as a json string
//     let queryStr = JSON.stringify(requestQuery)

//     //! RegEx to find greater than, greater than equal to, less than, less than or equal to, or in
//     //! Mongo operators - on match, we're passing a function as the second argument of replace
//     //! this will replace the match with $match - the structure we need to use for 
//     //! mongo db

//     queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

//     //* pass the query string as a JSON obj to mongo
//     query = model.find(JSON.parse(queryStr))

//     //? Handle Reserved Term Logic

//     // Select fields = if select is present in element 1 of req.query
//     if (req.query.select) {
//         // mongoose whats space separated values to 'SELECT' or return
//         // i.e. - city state careers -
//         const fields = req.query.select.split(',').join(' ')

//         query = query.select(fields)
//     }

//     if (req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(' ')
//         query = query.sort(sortBy)
//     } else {
//         query = query.sort('-createdAt')
//     }

//     //* Pagination and Limit
//     // default page = 1 else query page
//     const pageNumber = parseInt(req.query.page, 10) || 1;
//     const limitNumber = parseInt(req.query.limit, 10) || 25;
//     const startIndex = (pageNumber - 1) * limitNumber //skip
//     const endIndex = (pageNumber * limitNumber) //
//     const totalAmount = await model.countDocuments()

//     // skip on page 1 would be 1-1 = 0 * 100 = 0
//     // skip on page 2 would be 2 -1 = 1 * 100 = 100
//     // skip on page 3 would be 3 - 1 = 2 * 100 = 200

//     query = query.skip(startIndex).limit(limitNumber);

//     // Add the populate on for mongoose
//     if (populate) {
//         query = query.populate(populate)
//     }

//     // we can update bootcamp.find() w/ query from the line above
//     const results = await query

//     //* pagination result

//     const pagination = {}

//     // if we have more pages to go...
//     if (endIndex < totalAmount) {
//         pagination.next = {
//             nextPage: pageNumber + 1,
//             limit: limitNumber
//         }
//     } 

//     if (startIndex > 0) {
//         pagination.previous = {
//             previousPage: pageNumber -1,
//             limit: limitNumber
//         }
//     }

//     res.advancedResults = {
//         success: true,
//         count: results.length,
//         pagination: pagination,
//         data: results
//     }
//     next()
// }

// module.exports = advancedResults;