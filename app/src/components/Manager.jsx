import React from "react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import "react-toastify/dist/ReactToastify.css";
import { json } from "react-router-dom";

const Manager = () => {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [visibility, setVisibility] = useState(false);
  const ref = useRef();
  const passwordRef = useRef();

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    console.log(passwords);
    setPasswordArray(passwords);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const showPassword = () => {
    setVisibility(!visibility);

    passwordRef.current.type = visibility ? "text" : "password";
    ref.current.innerText = visibility ? "visibility" : "visibility_off";
  };

  const savePassword = async () => {
    try {
      if (
        form.site.length > 3 &&
        form.username.length > 3 &&
        form.password.length > 3
      ) {
        // Check if updating an existing entry
        if (form.id) {
          // Delete existing entry first (check URL and body for correctness)
          await fetch(`http://localhost:3000/`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
        }

        // Add new entry
        const newEntry = { ...form, id: uuidv4() };
        await fetch("http://localhost:3000/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEntry),
        });

        // Update local array after successful backend update
        setPasswordArray([...passwordArray, newEntry]);
        setForm({ site: "", username: "", password: "" });
        toast("Password saved successfully!");
      } else {
        toast("Error: Your information is too short to be saved!");
      }
    } catch (error) {
      console.error("Error saving password:", error);
      toast("An error occurred while saving the password.");
    }
  };

  const deletePassword = async (id) => {
    console.log("Deleting password with id", id);

    setPasswordArray(passwordArray.filter((item) => item.id !== id));
    let res = await fetch("http://localhost:3000/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    // localStorage.setItem(
    //   "passwords",
    //   JSON.stringify([...passwordArray, { ...form, id: uuidv4() }])
    // );

    toast("Password deleted succesfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  // const editPassword = async (id) => {
  //   console.log("Editing password with id", id);

  //   try {
  //     // Find the password to edit in the state array
  //     const passwordToEdit = passwordArray.find((item) => item.id === id);

  //     // Update password object with form values (assuming form has updated values)
  //     const updatedPassword = { ...passwordToEdit, ...form };

  //     // Make a PUT request to the backend API endpoint for updates (replace URL)
  //     await fetch(`http://localhost:3000/`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(updatedPassword),
  //     });

  //     // Update the local array after successful backend update
  //     setPasswordArray(
  //       passwordArray.map((item) => (item.id === id ? updatedPassword : item))
  //     );

  //     setForm({ site: "", username: "", password: "" }); // Clear form after successful edit
  //     toast("Password updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating password:", error);
  //     toast("An error occurred while updating the password.");
  //   }
  // };

  const editPassword = (id) => {
    console.log("Editing password with id", id);
    setForm({ ...passwordArray.filter((item) => item.id === id)[0], id: id });

    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_100%_at_50%_40%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>

      <div className="container px-48 ">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-500"> &lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-center text-lg">
          Your own Password Manager
        </p>
        <div className="text-black flex flex-col p-4 gap-8">
          <input
            value={form.site}
            onChange={(e) => handleChange(e)}
            className="p-4 py-1 rounded-full border border-green-500 w-full"
            type="text"
            name="site"
            placeholder="Enter Webiste URL"
          />
          <div className="flex w-full gap-8 justify-between">
            <input
              value={form.username}
              onChange={(e) => handleChange(e)}
              className="p-4 py-1 rounded-full border border-green-500 w-full"
              type="password"
              name="username"
              placeholder="Enter username"
            />
            <div className="relative gap-2 flex w-1/2">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={(e) => handleChange(e)}
                className="p-4 py-1 rounded-full border border-green-500 w-full"
                type="text"
                name="password"
                placeholder="Enter password"
              />
              <span className="absolute cursor-pointer right-[2px] top-[3px]">
                <span
                  ref={ref}
                  onClick={showPassword}
                  className="material-symbols-outlined px-[6px] py-1"
                >
                  visibility
                </span>
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              onClick={savePassword}
              className="mybutton flex gap-2 justify-center items-center w-fit bg-green-400 rounded-full px-6 py-2 hover:px-8 duration-300 border hover:bg-green-200 hover:font-semibold  transition-all hover:text-green-900 border-green-800 disabled:cursor-not-allowed disabled:bg-green-200 disabled:transition-none disabled:text-gray-500"
            >
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="loop"
                delay="2000"
              ></lord-icon>
              Save Data
            </button>
          </div>
        </div>
      </div>

      <div className="passwords px-28 relative overflow-y-auto my-3">
        <h2 className="font-bold text-2xl py-4 text-center">Your Passwords</h2>{" "}
        {passwordArray.length === 0 && <div>No passwords to show</div>}
        {passwordArray.length != 0 && (
          <table className="table-auto w-full rounded-md overflow-hidden">
            <thead className="bg-green-800 text-white w-full">
              <tr className="">
                <th className="py-2 border border-gray-500 text-lg">
                  <span className="material-symbols-outlined text-gray-400 ">
                    language
                  </span>{" "}
                  Site
                </th>
                <th className="py-2 border border-gray-500 text-lg">
                  <span className="material-symbols-outlined  text-gray-400">
                    person
                  </span>{" "}
                  Username
                </th>
                <th className="py-2 border border-gray-500 text-lg">
                  <span className="material-symbols-outlined  text-gray-400">
                    lock
                  </span>{" "}
                  Password
                </th>
                <th className="py-2 border border-gray-500 text-lg">
                  <span className="material-symbols-outlined  text-gray-400">
                    help
                  </span>{" "}
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-green-100">
              {passwordArray.map((item, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2 border border-white text-center w-32">
                      <a href={item.site} target="_blank">
                        {item.site}
                      </a>{" "}
                      <span
                        onClick={() => copyText(item.site)}
                        className="material-symbols-outlined cursor-pointer size-6 hover:bg-green-200 hover:rounded-full mt-2 "
                      >
                        content_copy
                      </span>
                    </td>
                    <td className="py-2 border border-white text-center w-32">
                      {item.username}
                      <span
                        onClick={() => copyText(item.username)}
                        className="material-symbols-outlined cursor-pointer size-6 hover:bg-green-200 hover:rounded-full mt-2 "
                      >
                        content_copy
                      </span>
                    </td>
                    <td className="py-2 border border-white text-center w-32">
                      {"*".repeat(item.password.length)}
                      <span
                        onClick={() => copyText(item.password)}
                        className="material-symbols-outlined cursor-pointer size-6  hover:bg-green-200 hover:rounded-full mt-2 "
                      >
                        content_copy
                      </span>
                    </td>
                    <td className="py-2 border border-white text-center w-32">
                      <span
                        onClick={() => editPassword(item.id)}
                        className="material-symbols-outlined cursor-pointer mx-4 size-6 mt-2 hover:bg-green-200 hover:rounded-full"
                      >
                        edit
                      </span>

                      <span
                        onClick={() => deletePassword(item.id)}
                        className="material-symbols-outlined cursor-pointer size-6 mt-2  hover:bg-green-200 hover:rounded-full"
                      >
                        delete
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Manager;
