import { YoutubeVideo } from '@embetty/base'
import { Router } from 'express'
import { embetty } from '../../embetty'
import { BadRequestException } from '../../exceptions'

let router: Router = Router()

router.param('id', async (_req, res, next, id: string) => {
  try {
    id = id.replace('-poster-image', '')

    if (!/^[\w-]+$/.test(id)) {
      throw new BadRequestException()
    }

    res.locals.video = await embetty.loadYoutubeVideo(id)
    next()
  } catch (error) {
    next(error)
  }
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/:id-poster-image', async (_req, res, next) => {
  try {
    let image = await (res.locals.video as YoutubeVideo).getPosterImage()

    if (!image) {
      next()
      return
    }

    res.type(image.type)
    res.send(image.data)
  } catch (error) {
    next(error)
  }
})

router.get('/:id.amp', (req, res) => {
  let attributes = { ...req.query }

  res.render('video.html', {
    video: res.locals.video as YoutubeVideo,
    attributes,
  })
})

router.get('/:id', (_req, res) => {
  res.send(res.locals.video)
})

export let youtubeRouter = router
