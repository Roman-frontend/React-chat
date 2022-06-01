import React, { useState, useEffect, useRef } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { blue } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";
import { AUTH, GET_USERS } from "../../../GraphQLApp/queryes";
import { CREATE_CHANNEL } from "../../SetsUser/SetsUserGraphQL/queryes";
import { SelectPeople } from "../SelectPeople/SelectPeople.jsx";
import { reactiveVarChannels } from "../../../GraphQLApp/reactiveVars";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    minWidth: "520px",
    minHeight: "425px",
    margin: 0,
  },
  input: {
    height: "30px",
    width: "220px",
  },
}));

const helperTextStyles = makeStyles((theme) => ({
  root: {
    margin: 4,
    color: "red",
  },
}));

export const AddChannel = (props) => {
  const {
    setModalAddChannelIsOpen,
    modalAddChannelIsOpen,
    isErrorInPopap,
    setIsErrorInPopap,
  } = props;
  const popapClasses = useStyles();
  const helperTestClasses = helperTextStyles();
  const { data: auth } = useQuery(AUTH);
  const { data: allUsers } = useQuery(GET_USERS);
  const { enqueueSnackbar } = useSnackbar();
  const [isPrivate, setIsPrivate] = useState(false);
  const notInvitedRef = useRef();
  const [form, setForm] = useState({
    name: "",
    discription: "",
    isPrivate: false,
    members: [],
  });
  const theme = useTheme();

  const [createChannel] = useMutation(CREATE_CHANNEL, {
    update(cache, { data: { channel } }) {
      cache.modify({
        fields: {
          userChannels(existingChannels) {
            const newChannelRef = cache.writeFragment({
              data: channel.create,
              fragment: gql`
                fragment NewChannel on Channel {
                  id
                  name
                  admin
                  members
                  isPrivate
                }
              `,
            });
            return [...existingChannels, newChannelRef];
          },
        },
      });
    },
    onCompleted(data) {
      const storage = JSON.parse(sessionStorage.getItem("storageData"));
      const toStorage = JSON.stringify({
        ...storage,
        channels: [...storage.channels, data.channel.create.id],
      });
      sessionStorage.setItem("storageData", toStorage);
      reactiveVarChannels([...reactiveVarChannels(), data.channel.create.id]);
      enqueueSnackbar("Channel created!", { variant: "success" });
    },
    onError(error) {
      console.log(`Помилка при створенні каналу ${error}`);
      enqueueSnackbar("Channel isn`t created!", { variant: "error" });
    },
  });

  useEffect(() => {
    if (allUsers && allUsers.users && auth) {
      const peoplesInvite = allUsers.users.filter(
        (people) => people.id !== auth.id
      );
      notInvitedRef.current = peoplesInvite;
    }
  }, [allUsers]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const doneCreate = (action, invited = []) => {
    if (action === "done" && form.name.trim() !== "") {
      const listInvited = invited[0] ? invited.concat(auth.id) : [auth.id];
      createChannel({
        variables: { ...form, admin: auth.id, members: listInvited },
      });
      setIsErrorInPopap(false);
      setModalAddChannelIsOpen(false);
    } else {
      setIsErrorInPopap(true);
    }
  };

  const closePopap = () => {
    setIsErrorInPopap(false);
    setModalAddChannelIsOpen(false);
  };

  function changeIsPrivate() {
    setForm((prev) => {
      return { ...prev, isPrivate: !isPrivate };
    });
    setIsPrivate(!isPrivate);
  }

  return (
    <div>
      <Dialog
        open={modalAddChannelIsOpen}
        onClose={() => setModalAddChannelIsOpen(false)}
        scroll="body"
        classes={{ paper: popapClasses.dialogPaper }}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.main,
          },
        }}
      >
        <DialogTitle>Create a channel</DialogTitle>
        <DialogContent>
          <DialogContentText color="inherit">
            Channels are where your team communicates. They’re best when
            organized around a topic — #marketing, for example.
          </DialogContentText>

          <div className="set-channel-forms" id="add-private-channel">
            <label className="set-channel-forms__label">Private</label>
            <Checkbox
              color="warning"
              checked={isPrivate}
              onClick={changeIsPrivate}
            />
          </div>
          <TextField
            variant="standard"
            label="Name"
            color="secondary"
            classes={{ root: popapClasses.input }}
            sx={{ color: "white" }}
            name="name"
            required={true}
            helperText={isErrorInPopap ? "required" : ""}
            FormHelperTextProps={{ classes: helperTestClasses }}
            value={form.name}
            onChange={changeHandler}
          />

          <TextField
            variant="standard"
            color="secondary"
            label="Discription"
            sx={{ display: "flex", margin: "27px 0px 20px" }}
            name="discription"
            value={form.discription.value}
            onChange={changeHandler}
          />
          <SelectPeople
            isDialogChanged={true}
            closePopap={closePopap}
            notInvitedRef={notInvitedRef.current}
            isErrorInPopap={isErrorInPopap}
            done={doneCreate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
