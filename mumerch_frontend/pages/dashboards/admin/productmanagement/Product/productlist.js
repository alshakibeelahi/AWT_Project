import axios from "axios"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAlert } from "../../../../utils/alertcontext"
const AdminLayout = dynamic(() => import("../../../../components/dashboards/admin/adminlayout"))
const Title = dynamic(() => import("../../../../components/title"))

export default function BandManagerList() {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [designation, setDesignation] = useState('')
  const [band, setBand] = useState('')
  const [bandError, setBandError] = useState('')
  const [designationError, setDesignationError] = useState('')
  const [allDesignation, setAllDesignation] = useState('')
  const [allBands, setAllBands] = useState('')
  const [searchName, setSearchName] = useState('')
  const [users, setUsers] = useState('')
  const { showAlert } = useAlert()
  const router = useRouter()
  const handleChangeSearchName = (e) => {
    setSearchName(e.target.value);
  }
  const handleChangeDesignation = (e) => {
    setDesignation(e.target.value);
    setDesignationError('')
  }
  const handleChangeBand = (e) => {
    setBand(e.target.value);
    setBandError('')
  }
  const handleChangeName = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Z][a-zA-z ]*$/.test(inputValue)) {
      setName(inputValue);
      setNameError('')
    }
    else {
      setNameError('Name should start with a capital letter')
    }
    if (inputValue == "") {
      setName('')
    }
  }
  const handleChangeEmail = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
    setEmailError('');

    if (!checkEmail(inputValue)) {
      setEmailError('Incorrect email format');
    }
  };
  const handleChangePhone = (e) => {
    const inputValue = e.target.value;
    setPhone(inputValue);
    setPhoneError('');

    if (!checkPhone(inputValue)) {
      setPhoneError('Incorrect phone number format');
    }
  };

  function checkPhone(data) {
    if (/^01[3-9]\d{8}$/.test(data)) {
      return true
    }
    else {
      return false
    }
  }
  function checkEmail(data) {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data)) {
      return true
    }
    else {
      return false
    }
  }
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!designation) {
      setDesignationError('Select a designation')
    }
    if (!band) {
      setBandError('Select a Band')
    }
    if (!checkEmail(email) || !checkPhone(phone)) {
      showAlert('Must provide valid email and phone number')
    }
    if (!name || !phone || !email || !designation || !band) {
      showAlert('Must provide name, phone, email, designation and band properly')
    }
    else {
      const result = await addUser(name, email, phone, designation, band)
      if (result != null) {
        showAlert(`User added successfully`)
        getUsers()
        setName('')
        setEmail('')
        setPhone('')
        setDesignation('')
        setBandError('')
      }
      else {
        showAlert(`User Couldnot added`)
        setName('')
        setEmail('')
        setPhone('')
        setDesignation('')
        setBandError('')
      }
      setName('')
      setEmail('')
      setPhone('')
      setDesignation('')
      setBandError('')
    }
  }
  async function addUser(name, email, phone, designation, band) {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/addbandmanager'
      const userData = {
        name: name,
        email: email,
        phoneNumber: phone,
        designation: designation,
        bandId: band
      }
      const result = await axios.post(url, userData, {
        withCredentials: true
      });
      return result
    }
    catch (err) {
      console.log(err)
      showAlert('Something went wrong, try again')
    }
  }
  const getUsers = async (e) => {
    try {
      const searchingName = searchName == undefined ? undefined : searchName
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/getbandmanagerbyname/' + searchingName;
      const result = await axios.get(url, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      })
      setUsers(result.data)
      if (result.data.length === 0) {
        showAlert('No user found')
      }
      else {
        return result.data
      }
    }
    catch (err) {
      console.log(err)
      showAlert("Something went wrong, please try again letter")
    }
  };

  const getAllDesignations = async (e) => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/getalldesignations';
      const result = await axios.get(url, {
        withCredentials: true
      })
      setAllDesignation(result.data)
    }
    catch (err) {
      console.log(err)
      showAlert("Something went wrong, please try again letter")
    }
  };

  const getAllBands = async (e) => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/getBandfordropdown';
      const result = await axios.get(url, {
        withCredentials: true
      })
      setAllBands(result.data)
    }
    catch (err) {
      console.log(err)
      showAlert("Something went wrong, please try again letter")
    }
  };

  const handleUpdate = (id) => {
    router.push(`./updatebandmanager?id=${id}`)
  }
  const handleDelete = async (id) => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/deletebandmanager/' + id
      const result = await axios.delete(url, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      })
      showAlert(result.data)
      getUsers()
    }
    catch (err) {
      showAlert('Couldnot perform delete operations, try again')
    }
  }
  useEffect(() => {
    getUsers();
    getAllDesignations()
    getAllBands()
  }, [searchName]);
  return (
    <>
      <Title page="Band Manager List"></Title>
      <AdminLayout>
        <section class="bg-gray-50 dark:bg-gray-900 sm:p-5">
          <div class="mx-auto max-w-screen-xl">
            <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div class="w-full md:w-1/2">
                  <form class="flex items-center">
                    <label for="simple-search" class="sr-only">Search</label>
                    <div class="relative w-full">
                      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required="" />
                    </div>
                  </form>
                </div>
                <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                  <Link href={'addproduct'} type="button" class="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path clip-rule="evenodd" fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                    Add product
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AdminLayout>
    </>
  )
}