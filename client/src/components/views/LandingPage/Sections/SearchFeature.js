import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

function SearchFeature(props) {
  const [SearchTerms, setSearchTerms] = useState("");

  const onChangeSearch = (event) => {
    setSearchTerms(event.currentTarget.value);

    props.refreshFunction(event.currentTarget.value);
  };

  return (
    <>
      <TextField
        label="Search Listings By Typing..."
        type="search"
        variant="outlined"
        value={SearchTerms}
        onChange={onChangeSearch}
        margin='dense'
        style={{width:'50%', marginBottom: '15px'}}
        InputProps={{
    endAdornment: (
      <InputAdornment>
          <SearchIcon />
      </InputAdornment>
    )
  }}
      />

    </>
  );
}

export default SearchFeature;
