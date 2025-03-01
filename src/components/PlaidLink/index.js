import {useCallback, useEffect, useState} from 'react';
import {usePlaidLink} from 'react-plaid-link';
import {plaidLinkPropTypes, plaidLinkDefaultProps} from './plaidLinkPropTypes';
import Log from '../../libs/Log';

const PlaidLink = (props) => {
    const [isPlaidLoaded, setIsPlaidLoaded] = useState(false);
    const onSuccess = useCallback((publicToken, metadata) => {
        props.onSuccess({publicToken, metadata});
    }, []);

    const {open, ready, error} = usePlaidLink({
        token: props.token,
        onSuccess,
        onExit: (exitError, metadata) => {
            Log.info('[PlaidLink] Exit: ', false, {exitError, metadata});
            props.onExit();
        },
        onEvent: (event, metadata) => {
            Log.info('[PlaidLink] Event: ', false, {event, metadata});
        },
        onLoad: () => setIsPlaidLoaded(true),

        // The redirect URI with an OAuth state ID. Needed to re-initialize the PlaidLink after directing the
        // user to their respective bank platform
        receivedRedirectUri: props.receivedRedirectURI,
    });

    useEffect(() => {
        if (error) {
            props.onError(error);
            return;
        }

        if (!ready) {
            return;
        }

        if (!isPlaidLoaded) {
            return;
        }

        open();
    }, [ready, error, isPlaidLoaded]);

    return null;
};

PlaidLink.propTypes = plaidLinkPropTypes;
PlaidLink.defaultProps = plaidLinkDefaultProps;
PlaidLink.displayName = 'PlaidLink';
export default PlaidLink;
