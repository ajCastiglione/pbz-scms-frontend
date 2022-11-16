import { useDispatch } from "react-redux";
import * as actions from "../../../store/actions/index";
import { debounce } from "../../../utils";
import classes from "./Search.module.scss";
import TextField from "@material-ui/core/TextField";

function Search() {
    const dispatch = useDispatch();

    const onChange = e => {
        dispatch(actions.searchInventoryTerm(e.target.value));
        dispatch(actions.searchInventory(e.target.value));
    };

    const debouncedChangeHandler = debounce(onChange, 500);

    return (
        <div className={classes.search_wrapper}>
            <TextField
                id="outlined-search"
                label="Search by name"
                type="search"
                placeholder="Test 123..."
                variant="outlined"
                onChange={debouncedChangeHandler}
            />
        </div>
    );
}

export default Search;
