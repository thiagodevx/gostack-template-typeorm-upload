import multer from 'multer'
import path from 'path'

const avatarFolter = path.resolve(__dirname, '../../tmp')
const multerConfiguration = {
  avatarFolter,
  storage: multer.diskStorage({
    destination: avatarFolter,
    filename: (_, file, callback) => {
      const fileTimestamp = Date.now().toString()
      const filename = `${fileTimestamp}-${file.originalname}`
      return callback(null, filename)
    }
  })
}

export default multerConfiguration
