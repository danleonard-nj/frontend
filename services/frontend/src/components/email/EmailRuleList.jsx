import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedEmailRule } from '../../store/email/emailSlice';
import Spinner from '../Spinner';
import { getEmailRule } from '../../store/email/emailActions';
import { scrollable } from '../../api/helpers/formattingHelpers';
import { useEffect, useState } from 'react';

const EmailRuleList = () => {
  const dispatch = useDispatch();

  // const [selectedEmailRule, setSelectedEmailRule] = useState(null);

  const { emailRules, emailRulesLoading, emailRule } = useSelector(
    (x) => x.email
  );

  const handleSelectRule = (rule) => {
    console.log('Selected rule: ', rule);
    // Update the state so we re-render
    // setSelectedEmailRule(rule);

    dispatch(setSelectedEmailRule(rule));
    dispatch(getEmailRule(rule.rule_id));
  };

  // Set the default selected rule if none is selected
  useEffect(() => {
    if (!emailRule?.rule_id && emailRules.length > 0) {
      // setSelectedEmailRule(emailRules[0]);
      handleSelectRule(emailRules[0]);
    }
  }, [emailRules, dispatch]);

  return emailRulesLoading ? (
    <Spinner />
  ) : (
    <List sx={scrollable}>
      {emailRules.map((rule) => (
        <ListItem id={rule.rule_id} disablePadding>
          <ListItemButton onClick={() => handleSelectRule(rule)}>
            <ListItemText primary={rule.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export { EmailRuleList };
