import { useDispatch } from "react-redux";
import { debounce } from "../../../utils";
import classes from "./Search.module.scss";
import TextField from "@material-ui/core/TextField";

function Search({ onSearch, label, placeholder }) {
    const dispatch = useDispatch();

    const onChange = e => {
        dispatch(onSearch(e.target.value));
    };

    const debouncedChangeHandler = debounce(onChange, 500);

    return (
        <div className={classes.search_wrapper}>
            <TextField
                id="outlined-search"
                label={label}
                type="search"
                placeholder={placeholder}
                variant="outlined"
                onChange={debouncedChangeHandler}
            />
        </div>
    );
}

export default Search;
