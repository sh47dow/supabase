import '~/styles/style.scss'
import { useRouter } from 'next/router'

const Home = props => {
  const router = useRouter()

  const handleLogin = e => {
    e.preventDefault()
    router.push('/channels/[id]', '/channels/1')
  }

  return (
    <div className="container mx-auto h-full flex justify-center items-center mt-8">
      <div className="w-1/3 mt-8">
        <div className="border-teal p-8 border-t-12 bg-white mb-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">Username</label>
            <input
              type="text"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Your Username"
            />
          </div>

          <div className="flex items-center justify-between">
            <a
              onClick={handleLogin}
              href={'/channels'}
              className="bg-gray-900 hover:bg-teal text-white font-bold py-2 px-4 rounded"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
