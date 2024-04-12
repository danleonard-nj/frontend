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

const EmailRuleList = () => {
  const dispatch = useDispatch();

  const { emailRules, emailRulesLoading } = useSelector(
    (x) => x.email
  );

  const handleSelectRule = (rule) => {
    console.log('Selected rule: ', rule);
    dispatch(setSelectedEmailRule(rule));
    dispatch(getEmailRule(rule.rule_id));
  };

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
