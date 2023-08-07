import axios from "axios"
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic"
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
const AdminLayout = dynamic(() => import("../../../../components/dashboards/admin/adminlayout"))
const Title = dynamic(() => import("../../../../components/title"))

export default function UpdateSize() {
  const router = useRouter()
  const [size, setSize] = useState('')
  const [name, setName] = useState('')
  const [measurement, setMeasurement] = useState(0)
  const [error, setError] = useState('')
  const id = router.query.sid

  const handleChangeName = (e) => {
    setName(e.target.value)
  }
  const handleChangeMeasurement = (e) => {
    setMeasurement(e.target.value)
  }
  const getSizeById = async (e) => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/getsizebyid/' + id
      const responce = await axios.get(url)
      if (responce != null) {
        setSize(responce.data)
      }
      else {
        setError(`${id} not found`)
      }
    }
    catch (err) {
      console.log(err)
      router.push('./sizelist')
    }
  }
  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/updatesize/' + id
      const data = {
        name: !name ? size.name : name,
        measurement: !measurement ? size.measurement : measurement,
        login: "MM-0723-0001"
      }
      // console.log(data, url)
      const responce = await axios.put(url, data);
      if (responce != null) {
        router.push(`${responce.data.id}`)
      }
      else {
        setError('Something went wrong')
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (!id) {
      router.push('./sizelist')
    }
    else {
      getSizeById()
    }
  }, [])
  return (
    <>
      <Title page="Update Size"></Title>
      <div>
        <Link href={'./sizelist'}>
          <Image src="/icons/cancel.png" alt="cancel" height={25} width={25} />
        </Link>
        <h4>Update Size</h4>
        <span>{error && <p>{error}</p>}</span>
        <form onSubmit={handleEdit}>
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>:</td>
                <td><input type="text" name="name" placeholder={size.name} onChange={handleChangeName} /></td>
              </tr>
              <tr>
                <td>Neck Measurement (inch)</td>
                <td>:</td>
                <td><input type="number" name="measurement" placeholder={size.measurement} onChange={handleChangeMeasurement} /></td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value={'Edit'} />
          <Link href={'./sizelist'}><button>Calcel</button></Link>
        </form>
      </div >
    </>
  )
}