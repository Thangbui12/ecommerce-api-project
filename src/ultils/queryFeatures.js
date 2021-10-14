class QueryFeatures {
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }
  filter() {
    // Log query from params
    // http://localhost:5035/api/users?isAdmin=false&isActive=true
    const queryObj = { ...this.queryString };
    // console.log(queryObj);

    // exclude page sort limit fields query
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Filter more
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    // Sorting
    //http://localhost:5035/api/users?isAdmin=false&isActive=true&sort=-created
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
  limitfields() {
    // fields limit
    if (this.queryString.fields) {
      console.log(this.queryString.fields);
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    console.log(this);
    return this;
  }
  pagination() {
    // Pagination
    //&page=1&limit=3
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
export default QueryFeatures;
