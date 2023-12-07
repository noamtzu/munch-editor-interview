import { VideoProvider } from "../context/videoContext"
import { Display } from "./display/Display"
import { Trimmer } from "./timeline/trimmer/Trimmer"
import { Thumbs } from "./timeline/thumbs/Thumbs"

import { Timeline } from "./timeline/Timeline";

export const Player = () => {

    return (
        <VideoProvider>
            <Display />
            <Timeline />
        </VideoProvider>
    )
}