import spaceRegister from './space-controller'
import postRegister from './post-controller'

const contorllers = [
  { prefix: 'space', register: spaceRegister },
  { prefix: 'post', register: postRegister }
]

export default contorllers
