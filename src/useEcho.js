import { useState, useEffect } from 'react';
import { difference, pull } from 'lodash';
import usePrevious from 'react-hanger/usePrevious';

import EchoClient from '../utilities/EchoClient';

/**
 * @param channel String the channel to connect todo
 * @param events Object { [EventName]: function callback()  }
 */
const useEcho = ({ channel, events }) => {
  const [echoChannel, setEchoChannel] = useState(false);
  const [currentEvents, setCurrentEvents] = useState([]);

  const prevChannel = usePrevious(channel);
  const prevEventsKeys = usePrevious(Object.keys(events));

  useEffect(() => {
    // if the channel changed, disconnect before setting up the new connection
    if (echoChannel && channel !== prevChannel) {
      console.info( // eslint-disable-line
        'useEcho',
        'Leaving current channel',
        { prevChannel, channel, echoChannel },
      );
      EchoClient.leaveChannel(prevChannel);
    }

    if (!echoChannel || channel !== prevChannel) {
      echoChannel && echoChannel.disconnect();

      setEchoChannel(EchoClient.channel(channel));
    }

    return () => {
      if (echoChannel) {
        echoChannel.disconnect();
      }
    };
  }, [channel]);

  useEffect(() => {
    if (echoChannel && events) {
      const eventsKeys = Object.keys(events);

      const droppedEvents = difference(currentEvents, eventsKeys);
      const newEvents = difference(eventsKeys, currentEvents);

      if (droppedEvents && droppedEvents.length) {
        setCurrentEvents((state) => {
          droppedEvents.forEach(de => pull(state, de));
          return state;
        });
      }

      if (newEvents && newEvents.length) {
        setCurrentEvents((state) => {
          newEvents.forEach((ne) => {
            state.push(ne);
            echoChannel.listen(ne, events[ne]);
          });
          return state;
        });
      }
    }
  }, [echoChannel, Object.keys(events) === prevEventsKeys]);
};

export default useEcho;
